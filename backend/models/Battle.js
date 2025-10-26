const mongoose = require('mongoose');

const BattleSchema = new mongoose.Schema({
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
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
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
    answers: [{
      challengeId: mongoose.Schema.Types.ObjectId,
      answer: Number,
      isCorrect: Boolean,
      timeTaken: Number,
      submittedAt: Date
    }]
  }],
  challengeType: {
    type: String,
    enum: ['music', 'logic', 'trivia', 'creative', 'math', 'mixed'],
    default: 'mixed'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  challengeCount: {
    type: Number,
    default: 5
  },
  currentChallenge: {
    type: Number,
    default: 0
  },
  challenges: [{
    type: mongoose.Schema.Types.Mixed,
    default: []
  }],
  status: {
    type: String,
    enum: ['waiting', 'starting', 'active', 'finished'],
    default: 'waiting'
  },
  timeLimit: {
    type: Number, // in seconds
    default: 60
  },
  startedAt: {
    type: Date
  },
  finishedAt: {
    type: Date
  },
  results: [{
    userId: mongoose.Schema.Types.ObjectId,
    totalScore: Number,
    correctCount: Number,
    rank: Number,
    timeBonus: Number
  }],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate unique battle code
BattleSchema.statics.generateCode = function() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Check if code is available
BattleSchema.statics.isCodeAvailable = async function(code) {
  const existing = await this.findOne({ code: code.toUpperCase() });
  return !existing;
};

// Get live leaderboard for battle
BattleSchema.methods.getLiveLeaderboard = function() {
  return this.participants
    .map(p => ({
      userId: p.userId,
      score: p.score,
      correctCount: p.answers.filter(a => a.isCorrect).length
    }))
    .sort((a, b) => b.score - a.score)
    .map((p, index) => ({
      ...p,
      rank: index + 1
    }));
};

module.exports = mongoose.model('Battle', BattleSchema);
