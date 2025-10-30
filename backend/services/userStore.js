const bcrypt = require('bcryptjs');
const mongooseUser = require('../models/User');
const { getFirestore, isFirebaseEnabled } = require('../config/firebase');

const USERS_COLLECTION = 'users';

// Helpers for Firestore
async function fsGetUserDocById(id) {
  const db = getFirestore();
  if (!db) return null;
  const ref = db.collection(USERS_COLLECTION).doc(id);
  const snap = await ref.get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

async function fsGetUserByEmail(email) {
  const db = getFirestore();
  if (!db) return null;
  const snap = await db.collection(USERS_COLLECTION).where('email', '==', email).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function fsCreateUser({ name, email, passwordHash }) {
  const db = getFirestore();
  if (!db) return null;
  const ref = db.collection(USERS_COLLECTION).doc();
  const now = new Date().toISOString();
  const userData = {
    name,
    email,
    passwordHash,
    stats: {
      totalPoints: 0,
      level: 1,
      correctAnswers: 0,
      wrongAnswers: 0,
      streak: 0,
      highestStreak: 0
    },
    answeredQuestions: [],
    createdAt: now,
    updatedAt: now
  };
  await ref.set(userData);
  return { id: ref.id, ...userData };
}

async function fsUpdateStats(userId, updater) {
  const db = getFirestore();
  const ref = db.collection(USERS_COLLECTION).doc(userId);
  const snap = await ref.get();
  if (!snap.exists) return null;
  const current = snap.data();
  const next = updater({ ...current.stats });
  await ref.update({ stats: next, updatedAt: new Date().toISOString() });
  return next;
}

async function fsGetAnsweredSet(userId) {
  const db = getFirestore();
  const ref = db.collection(USERS_COLLECTION).doc(userId);
  const snap = await ref.get();
  if (!snap.exists) return new Set();
  const arr = snap.data().answeredQuestions || [];
  return new Set(arr);
}

async function fsAddAnsweredHash(userId, hash) {
  const db = getFirestore();
  const ref = db.collection(USERS_COLLECTION).doc(userId);
  await ref.set({ answeredQuestions: admin.firestore.FieldValue.arrayUnion(hash), updatedAt: new Date().toISOString() }, { merge: true });
}

// Public API (switch by provider)
async function getUserById(id) {
  if (isFirebaseEnabled()) return fsGetUserDocById(id);
  const u = await mongooseUser.findById(id).select('-password');
  return u ? { id: u._id.toString(), ...u.toObject() } : null;
}

async function findUserByEmail(email) {
  if (isFirebaseEnabled()) return fsGetUserByEmail(email);
  const u = await mongooseUser.findOne({ email });
  return u ? { id: u._id.toString(), ...u.toObject() } : null;
}

async function createUser({ name, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  if (isFirebaseEnabled()) return fsCreateUser({ name, email, passwordHash });
  const u = new mongooseUser({ name, email, password });
  await u.save();
  return { id: u._id.toString(), ...u.toObject() };
}

async function comparePassword(userRecord, password) {
  if (isFirebaseEnabled()) {
    const hash = userRecord.passwordHash;
    if (!hash) return false;
    return bcrypt.compare(password, hash);
  }
  // For mongoose, userRecord may be plain object without method; fetch and compare
  const user = await mongooseUser.findById(userRecord.id);
  if (!user) return false;
  return user.comparePassword(password);
}

async function getAnsweredSet(userId) {
  if (isFirebaseEnabled()) return fsGetAnsweredSet(userId);
  const u = await mongooseUser.findById(userId).select('answeredQuestions');
  const arr = (u && u.answeredQuestions) || [];
  return new Set(arr);
}

async function addAnsweredHash(userId, hash) {
  if (isFirebaseEnabled()) {
    const db = getFirestore();
    const admin = require('firebase-admin');
    const ref = db.collection(USERS_COLLECTION).doc(userId);
    await ref.set({ answeredQuestions: admin.firestore.FieldValue.arrayUnion(hash), updatedAt: new Date().toISOString() }, { merge: true });
    return;
  }
  await mongooseUser.findByIdAndUpdate(userId, { $addToSet: { answeredQuestions: hash } }, { upsert: true, new: true });
}

async function updateStats(userId, correct) {
  if (isFirebaseEnabled()) {
    return fsUpdateStats(userId, (stats) => {
      const next = { ...stats };
      if (correct) {
        next.totalPoints = (next.totalPoints || 0) + 10;
        next.correctAnswers = (next.correctAnswers || 0) + 1;
        next.streak = (next.streak || 0) + 1;
        if ((next.streak || 0) > (next.highestStreak || 0)) {
          next.highestStreak = next.streak;
        }
        next.level = Math.floor((next.totalPoints || 0) / 100) + 1;
      } else {
        next.wrongAnswers = (next.wrongAnswers || 0) + 1;
        next.streak = 0;
      }
      return next;
    });
  }
  const user = await mongooseUser.findById(userId);
  if (!user) return null;
  if (correct) {
    user.stats.totalPoints += 10;
    user.stats.correctAnswers += 1;
    user.stats.streak += 1;
    if (user.stats.streak > user.stats.highestStreak) {
      user.stats.highestStreak = user.stats.streak;
    }
    user.stats.level = Math.floor(user.stats.totalPoints / 100) + 1;
  } else {
    user.stats.wrongAnswers += 1;
    user.stats.streak = 0;
  }
  await user.save();
  return user.stats;
}

module.exports = {
  getUserById,
  findUserByEmail,
  createUser,
  comparePassword,
  getAnsweredSet,
  addAnsweredHash,
  updateStats,
  isFirebaseEnabled
};


