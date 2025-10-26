const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    score: {
      type: Number,
      default: 0
    },
    answers: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    }
  }],
  challengeType: {
    type: String,
    enum: ['music', 'logic', 'trivia', 'creative', 'math'],
    default: 'music'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  currentChallenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    default: null
  },
  status: {
    type: String,
    enum: ['waiting', 'playing', 'finished'],
    default: 'waiting'
  },
  maxMembers: {
    type: Number,
    default: 10
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  startedAt: {
    type: Date
  },
  finishedAt: {
    type: Date
  },
  results: {
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    scores: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      totalScore: Number,
      correctAnswers: Number,
      timeBonus: Number
    }]
  }
}, {
  timestamps: true
});

// Generate unique room code
GroupSchema.statics.generateCode = function() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Check if code is available
GroupSchema.statics.isCodeAvailable = async function(code) {
  const existing = await this.findOne({ code: code.toUpperCase() });
  return !existing;
};

module.exports = mongoose.model('Group', GroupSchema);
