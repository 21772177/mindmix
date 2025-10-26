const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  challengeType: {
    type: String,
    required: true,
    enum: ['music', 'logic', 'trivia', 'creative', 'math']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  },
  stage: {
    type: Number,
    default: 1
  },
  points: {
    type: Number,
    default: 0
  },
  coins: {
    type: Number,
    default: 0
  },
  xp: {
    type: Number,
    default: 0
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  timeTaken: {
    type: Number, // in milliseconds
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
ScoreSchema.index({ userId: 1, completedAt: -1 });
ScoreSchema.index({ userId: 1, challengeType: 1 });
ScoreSchema.index({ userId: 1, stage: 1 });

// Calculate XP based on difficulty and correctness
ScoreSchema.methods.calculateXP = function() {
  const difficultyPoints = {
    'easy': 10,
    'medium': 30,
    'hard': 50
  };
  
  const baseXP = difficultyPoints[this.difficulty] || 10;
  const bonus = this.isCorrect ? baseXP : Math.floor(baseXP * 0.5);
  const timeBonus = this.isCorrect && this.timeTaken < 5000 ? Math.floor(baseXP * 0.2) : 0;
  
  this.xp = bonus + timeBonus;
  return this.xp;
};

// Calculate coins
ScoreSchema.methods.calculateCoins = function() {
  const difficultyCoins = {
    'easy': 5,
    'medium': 15,
    'hard': 30
  };
  
  this.coins = this.isCorrect ? difficultyCoins[this.difficulty] || 5 : 0;
  return this.coins;
};

module.exports = mongoose.model('Score', ScoreSchema);
