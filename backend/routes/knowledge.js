const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const KnowledgeQuiz = require('../models/KnowledgeQuiz');
const mockQuizzes = require('../data/knowledgeQuizzes.json');
const upscMpscQuizzes = require('../data/upscMpscQuizzes.json');
const { withRetry } = require('../../ai_engine/retry_helper');

// Initialize OpenAI only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
  const OpenAI = require('openai');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}
const { filterAnsweredQuestions, markQuestionAnswered } = require('../middleware/noRepeatHelper');

// Mock data fallback with UPSC/MPSC questions
const getMockQuiz = (topic, difficulty) => {
  let quizzes = [];
  
  // ONLY get questions for the current topic - no mixing!
  if (mockQuizzes[topic] && mockQuizzes[topic][difficulty]) {
    quizzes = [...mockQuizzes[topic][difficulty]];
    // Ensure each question has the correct topic
    quizzes = quizzes.map(q => ({ ...q, topic }));
  }
  
  // Add UPSC/MPSC questions for matching topics
  const upscTopicMap = {
    'history': 'history',
    'science': 'science',
    'geography': 'geography',
    'currentAffairs': 'currentAffairs',
    'polity': 'polity',
    'economics': 'economics',
    'general': 'general'
  };
  
  // For UPSC topics, get from upscMpscQuizzes directly
  if (['currentAffairs', 'polity', 'economics'].includes(topic) && upscMpscQuizzes[topic]) {
    const upscQuestions = [...upscMpscQuizzes[topic]];
    upscQuestions.forEach(q => q.topic = topic);
    quizzes = [...quizzes, ...upscQuestions];
  } else {
    const mappedTopic = upscTopicMap[topic] || topic;
    if (upscMpscQuizzes[mappedTopic] && upscMpscQuizzes[mappedTopic].length > 0) {
      const upscQuestions = [...upscMpscQuizzes[mappedTopic]];
      upscQuestions.forEach(q => q.topic = topic);
      quizzes = [...quizzes, ...upscQuestions];
    }
  }
  
  return quizzes.slice(0, 10);
};

// @route   GET /knowledge/topics
// @desc    Get available topics
// @access  Public
router.get('/topics', (req, res) => {
  const topics = [
    { id: 'history', name: '📚 History', description: 'Historical events, dates, and figures' },
    { id: 'science', name: '🔬 Science', description: 'Physics, chemistry, biology, and discoveries' },
    { id: 'geography', name: '🌍 Geography', description: 'Countries, capitals, landmarks' },
    { id: 'currentAffairs', name: '📰 Current Affairs', description: 'Latest news and events (UPSC level)' },
    { id: 'polity', name: '🏛️ Polity', description: 'Indian Constitution and governance (UPSC)' },
    { id: 'economics', name: '💰 Economics', description: 'Indian economy and policies (UPSC)' },
    { id: 'literature', name: '📖 Literature', description: 'Books, authors, and literary works' },
    { id: 'math', name: '🔢 Mathematics', description: 'Math problems and concepts' },
    { id: 'general', name: '✨ General Knowledge', description: 'Mixed trivia questions' }
  ];

  res.json({ ok: true, data: { topics } });
});

// @route   GET /knowledge/quiz/:topic
// @desc    Get quiz by topic (with AI-enhanced questions for UPSC/MPSC topics)
// @access  Public
router.get('/quiz/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    const { difficulty = 'medium', limit = 10, userId } = req.query;

    // Check if this is a UPSC/MPSC topic
    const upscTopics = ['currentAffairs', 'polity', 'economics', 'history', 'geography'];
    const isUPSC = upscTopics.includes(topic);

    // Try AI generation first if available
    let quizzes = [];
    
    // Always try AI first for all topics
    if (openai) {
      try {
        console.log(`🤖 Using AI to generate ${topic} quiz questions`);
        const aiQuizzes = await generateUPSCQuestions(topic, difficulty, 10);
        if (aiQuizzes && aiQuizzes.length > 0) {
          quizzes = aiQuizzes;
        }
      } catch (aiError) {
        console.log('AI generation failed, using mock data:', aiError.message);
      }
    }
    
    // Fallback to mock data if AI didn't work or is not available
    if (quizzes.length === 0) {
      quizzes = getMockQuiz(topic, difficulty);
    }

    // Format mock data to match schema
    quizzes = quizzes.map(q => ({
      _id: q._id || Math.random().toString(),
      topic: q.topic || topic,
      subTopic: q.subTopic || 'general',
      question: q.question || q.quiz,
      options: q.options,
      correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : q.answer,
      explanation: q.explanation || 'This is a carefully selected question. Consider all options.',
      difficulty: q.difficulty || difficulty,
      points: q.points || (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30),
      isMock: !q._id
    }));

    // Filter out questions user has already answered (for no-repeat system)
    if (userId) {
      console.log(`🔍 Filtering repeats for user ${userId}, topic: ${topic}`);
      quizzes = await filterAnsweredQuestions(quizzes, userId, topic);
      console.log(`✅ Returning ${quizzes.length} unique questions for topic: ${topic}`);
    }

    // Limit to requested amount
    quizzes = quizzes.slice(0, parseInt(limit));

    res.json({ 
      ok: true, 
      data: { 
        quizzes,
        totalAvailable: quizzes.length,
        message: quizzes.length < parseInt(limit) ? 'All available questions have been answered!' : null
      } 
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ ok: false, error: 'Failed to get quiz' });
  }
});

// Generate UPSC-level questions using AI
const generateUPSCQuestions = async (topic, difficulty, limit) => {
  let openai;
  
  try {
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
      const OpenAI = require('openai');
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } else {
      throw new Error('OpenAI API key not configured');
    }
  } catch (err) {
    throw new Error('OpenAI not available');
  }

  const topicMapping = {
    'currentAffairs': 'current affairs and recent developments in India and the world',
    'polity': 'Indian Constitution, political system, governance, and public administration',
    'economics': 'Indian economy, economic policies, banking, and financial systems',
    'history': 'Indian history, especially modern Indian history and freedom struggle',
    'geography': 'Indian geography, physical features, and geographical phenomena',
    'science': 'Science - physics, chemistry, biology, and general science',
    'literature': 'Literature - books, authors, poems, and literary works',
    'math': 'Mathematics - algebra, geometry, arithmetic, and problem-solving',
    'general': 'General knowledge - mixed trivia questions'
  };

  const topicDescription = topicMapping[topic] || topic;

  const prompt = `You are an expert UPSC/MPSC question creator. Generate ${limit} ${difficulty}-level multiple choice questions on ${topicDescription}.

Important:
- Questions should be UPSC/MPSC standard - challenging and relevant for competitive exams
- Each question must have exactly 4 options (A, B, C, D)
- Include a detailed, educational explanation
- Make questions practical and exam-oriented
- Focus on Indian context for current affairs, polity, and economics

Format your response as JSON array:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Detailed explanation here",
    "difficulty": "${difficulty}",
    "subTopic": "specific sub-topic"
  }
]`;

  try {
    const response = await withRetry(async () => {
      return await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 3000
      });
    });

    const content = response.choices[0].message.content;
    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0]);
      return questions.map(q => ({
        ...q,
        topic,
        points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30
      }));
    }
  } catch (err) {
    console.error('AI generation error:', err);
    throw err;
  }

  return [];
};

// @route   POST /knowledge/quiz/submit
// @desc    Submit quiz answer and get score
// @access  Private
router.post('/quiz/submit', protect, async (req, res) => {
  try {
    const { quizId, answer, timeTaken, questionText } = req.body;
    const userId = req.user.id;

    // For now, calculate if answer is correct
    // In production, fetch quiz from DB and verify
    const isCorrect = typeof answer === 'number';

    // Mark question as answered to prevent repetition
    if (questionText) {
      await markQuestionAnswered(questionText, userId);
    }

    res.json({
      ok: true,
      data: {
        correct: isCorrect,
        points: isCorrect ? 10 : 0
      }
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ ok: false, error: 'Failed to submit answer' });
  }
});

// @route   POST /knowledge/quiz/create
// @desc    Create a new quiz question
// @access  Private
router.post('/quiz/create', protect, async (req, res) => {
  try {
    const { topic, subTopic, question, options, correctAnswer, explanation, difficulty, tags } = req.body;

    // Validate
    if (!topic || !question || !options || options.length !== 4 || correctAnswer === undefined) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid quiz data' 
      });
    }

    const quiz = await KnowledgeQuiz.create({
      topic,
      subTopic,
      question,
      options,
      correctAnswer,
      explanation,
      difficulty,
      tags,
      points: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20,
      createdBy: userId
    });

    res.status(201).json({ ok: true, data: { quiz } });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ ok: false, error: 'Failed to create quiz' });
  }
});

// @route   GET /knowledge/stats
// @desc    Get user's knowledge stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // This would query user's quiz history
    // For now, return mock stats
    res.json({
      ok: true,
      data: {
        totalQuizzes: 0,
        correctAnswers: 0,
        accuracy: 0,
        topics: {
          history: 0,
          science: 0,
          geography: 0,
          literature: 0,
          math: 0,
          general: 0
        }
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ ok: false, error: 'Failed to get stats' });
  }
});

module.exports = router;
