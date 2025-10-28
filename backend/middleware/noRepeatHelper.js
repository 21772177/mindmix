const User = require('../models/User');

/**
 * Filter out questions that user has already answered
 * @param {Array} questions - Array of question objects
 * @param {String} userId - User ID
 * @param {String} challengeType - Type of challenge (optional)
 * @returns {Array} Filtered questions array
 */
// Cache for user's answered questions (in-memory cache)
const userCache = new Map();

const filterAnsweredQuestions = async (questions, userId, challengeType = null) => {
  try {
    // Check cache first
    if (userCache.has(userId)) {
      const answeredSet = userCache.get(userId);
      
      const filtered = questions.filter(q => {
        const textToHash = q.prompt || q.question;
        if (!textToHash) return true;
        const questionHash = createHash(textToHash);
        return !answeredSet.has(questionHash);
      });
      
      console.log(`🔍 Filtered ${questions.length - filtered.length} repeated questions (from cache)`);
      return filtered;
    }
    
    // Get user's answered questions (only if not in cache)
    const user = await User.findById(userId).select('answeredQuestions'); // Only fetch needed field
    if (!user || !user.answeredQuestions || user.answeredQuestions.length === 0) {
      return questions; // No answered questions, return all
    }

    // Create a hash of answered questions for fast lookup
    const answeredSet = new Set(user.answeredQuestions);
    
    // Cache it
    userCache.set(userId, answeredSet);

    // Filter questions based on prompt text hash
    const filtered = questions.filter(q => {
      // Use 'prompt' for challenges, 'question' for quizzes
      const textToHash = q.prompt || q.question;
      if (!textToHash) return true;
      
      // Create hash from question text
      const questionHash = createHash(textToHash);
      return !answeredSet.has(questionHash);
    });

    console.log(`🔍 Filtered ${questions.length - filtered.length} repeated questions for user ${userId} (type: ${challengeType || 'any'})`);
    return filtered;
  } catch (error) {
    console.error('Error filtering answered questions:', error);
    return questions; // Return all if error
  }
};

/**
 * Mark a question as answered for a user
 * @param {String} questionText - Question text (prompt or question field)
 * @param {String} userId - User ID
 */
const markQuestionAnswered = async (questionText, userId) => {
  try {
    if (!questionText || !userId) {
      console.log('⚠️ Cannot mark question: missing questionText or userId');
      return;
    }

    const questionHash = createHash(questionText);
    
    // Update cache first (fast)
    if (userCache.has(userId)) {
      const answeredSet = userCache.get(userId);
      if (!answeredSet.has(questionHash)) {
        answeredSet.add(questionHash);
        userCache.set(userId, answeredSet);
      }
    }
    
    // Update database asynchronously (don't wait)
    User.findByIdAndUpdate(
      userId,
      { $addToSet: { answeredQuestions: questionHash } },
      { upsert: true, new: true }
    ).then(() => {
      console.log(`✅ Marked question as answered for user ${userId}`);
    }).catch(err => {
      console.error('Error updating DB:', err);
    });
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
