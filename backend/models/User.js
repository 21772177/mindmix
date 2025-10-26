const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  challengesCreated: {
    type: Number,
    default: 0
  },
  challengesCompleted: {
    type: Number,
    default: 0
  },
  totalXP: {
    type: Number,
    default: 0
  },
  coins: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  stage: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  rankings: {
    global: { type: Number, default: 0 },
    music: { type: Number, default: 0 },
    logic: { type: Number, default: 0 },
    trivia: { type: Number, default: 0 },
    creative: { type: Number, default: 0 },
    math: { type: Number, default: 0 }
  },
  // Track answered questions to prevent repetition
  answeredQuestions: {
    type: [String], // Store question hashes
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate user level based on XP
UserSchema.methods.calculateLevel = function() {
  const xp = this.totalXP;
  // Level formula: sqrt(xp / 10)
  const level = Math.floor(Math.sqrt(xp / 10)) + 1;
  return Math.min(level, 100); // Max level 100
};

// Calculate stage based on level
UserSchema.methods.calculateStage = function() {
  return Math.floor(this.level / 10) + 1;
};

module.exports = mongoose.model('User', UserSchema);
