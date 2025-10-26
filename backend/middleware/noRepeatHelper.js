const User = require('../models/User');

/**
 * Filter out questions that user has already answered
 * @param {Array} questions - Array of question objects
 * @param {String} userId - User ID
 * @returns {Array} Filtered questions array
 */
const filterAnsweredQuestions = async (questions, userId) => {
  try {
    // Get user's answered questions
    const user = await User.findById(userId);
    if (!user || !user.answeredQuestions || user.answeredQuestions.length === 0) {
      return questions; // No answered questions, return all
    }

    // Create a hash of answered questions for fast lookup
    const answeredSet = new Set(user.answeredQuestions);

    // Filter questions based on text hash (more reliable than ID)
    const filtered = questions.filter(q => {
      if (!q.question) return true;
      
      // Create hash from question text
      const questionHash = createHash(q.question);
      return !answeredSet.has(questionHash);
    });

    console.log(`Filtered ${questions.length - filtered.length} repeated questions for user ${userId}`);
    return filtered;
  } catch (error) {
    console.error('Error filtering answered questions:', error);
    return questions; // Return all if error
  }
};

/**
 * Mark a question as answered for a user
 * @param {String} questionText - Question text
 * @param {String} userId - User ID
 */
const markQuestionAnswered = async (questionText, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const questionHash = createHash(questionText);
    
    // Add to answered questions if not already there
    if (!user.answeredQuestions.includes(questionHash)) {
      user.answeredQuestions.push(questionHash);
      
      // Keep only last 1000 answered questions to prevent array from growing too large
      if (user.answeredQuestions.length > 1000) {
        user.answeredQuestions = user.answeredQuestions.slice(-1000);
      }
      
      await user.save();
    }
  } catch (error) {
    console.error('Error marking question as answered:', error);
  }
};

/**
 * Create a simple hash from question text
 * @param {String} text - Question text
 * @returns {String} Hash
 */
const createHash = (text) => {
  // Simple hash function for question text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

module.exports = {
  filterAnsweredQuestions,
  markQuestionAnswered,
  createHash
};
