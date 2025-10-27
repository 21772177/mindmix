const mongoose = require('mongoose');

const BeatRushChallengeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['guess_song', 'guess_dialogue', 'complete_lyrics', 'instrument_match', 'memory_play'],
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  hints: [{
    type: String
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  points: {
    type: Number,
    default: 10
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

module.exports = mongoose.model('BeatRushChallenge', BeatRushChallengeSchema);

