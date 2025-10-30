const admin = require('firebase-admin');

let firestore = null;
let firebaseEnabled = false;

function initFirebase() {
  if (firestore) return firestore;

  try {
    const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
    const projectId = process.env.FIREBASE_PROJECT_ID;

    if (!svc || !projectId) {
      return null;
    }

    const serviceAccount = JSON.parse(svc);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId
    });

    firestore = admin.firestore();
    firebaseEnabled = true;
    console.log('✅ Firebase initialized (Firestore)');
  } catch (e) {
    console.warn('⚠️ Firebase init failed. Falling back to MongoDB if available.', e.message);
    firestore = null;
    firebaseEnabled = false;
  }

  return firestore;
}

function getFirestore() {
  if (!firestore) {
    initFirebase();
  }
  return firestore;
}

function isFirebaseEnabled() {
  return !!getFirestore();
}

module.exports = { getFirestore, isFirebaseEnabled };


