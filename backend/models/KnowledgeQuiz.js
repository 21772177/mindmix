const mongoose = require('mongoose');

const KnowledgeQuizSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    enum: ['history', 'science', 'geography', 'literature', 'math', 'general'],
    index: true
  },
  subTopic: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length === 4,
      message: 'Must have exactly 4 options'
    }
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  explanation: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  points: {
    type: Number,
    default: 10
  },
  tags: [String],
  verified: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Get random quiz by topic
KnowledgeQuizSchema.statics.getRandomByTopic = async function(topic, difficulty, limit = 10) {
  const query = { topic, verified: true };
  if (difficulty) {
    query.difficulty = difficulty;
  }
  
  const count = await this.countDocuments(query);
  const random = Math.floor(Math.random() * count);
  
  return this.find(query)
    .skip(random)
    .limit(limit);
};

module.exports = mongoose.model('KnowledgeQuiz', KnowledgeQuizSchema);
