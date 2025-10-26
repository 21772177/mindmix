const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['music', 'logic', 'trivia', 'creative', 'math']
  },
  prompt: {
    type: String,
    required: [true, 'Please add a prompt']
  },
  options: {
    type: [String],
    required: true
  },
  answer: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  timesPlayed: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
