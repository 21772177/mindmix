const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const User = require('../models/User');
const Challenge = require('../models/Challenge');

// @route   POST /scores/submit
// @desc    Submit challenge score
// @access  Private
router.post('/submit', require('../middleware/auth').protect, async (req, res) => {
  try {
    const { challengeId, challengeType, difficulty, isCorrect, timeTaken } = req.body;
    
    if (!challengeType || typeof isCorrect !== 'boolean') {
      return res.status(400).json({ 
        ok: false, 
        error: 'Please provide challengeType and isCorrect' 
      });
    }

    const userId = req.user.id;
    
    // Create score entry
    const score = new Score({
      userId,
      challengeId: challengeId || null,
      challengeType,
      difficulty: difficulty || 'easy',
      isCorrect,
      timeTaken: timeTaken || 0,
      stage: req.user.stage || 1
    });

    // Calculate XP and coins
    score.calculateXP();
    score.calculateCoins();
    score.points = isCorrect ? 1 : 0;

    await score.save();

    // Update user stats
    const user = await User.findById(userId);
    
    if (isCorrect) {
      user.challengesCompleted = (user.challengesCompleted || 0) + 1;
      user.totalXP = (user.totalXP || 0) + score.xp;
      user.coins = (user.coins || 0) + score.coins;
      user.totalPoints = (user.totalPoints || 0) + score.points;
      user.streak = (user.streak || 0) + 1;
      
      // Update category ranking
      if (user.rankings && user.rankings[challengeType] !== undefined) {
        user.rankings[challengeType] = (user.rankings[challengeType] || 0) + score.xp;
      }
    } else {
      user.streak = 0;
    }

    // Recalculate level and stage
    user.level = user.calculateLevel();
    user.stage = user.calculateStage();

    await user.save();

    res.json({
      ok: true,
      data: {
        score: {
          xp: score.xp,
          coins: score.coins,
          points: score.points,
          correct: isCorrect
        },
        user: {
          totalXP: user.totalXP,
          coins: user.coins,
          level: user.level,
          stage: user.stage,
          streak: user.streak
        }
      }
    });
  } catch (error) {
    console.error('Score submission error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to submit score',
      details: error.message 
    });
  }
});

// @route   GET /scores/history
// @desc    Get user's score history
// @access  Private
router.get('/history', require('../middleware/auth').protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, type } = req.query;

    const query = { userId };
    if (type) {
      query.challengeType = type;
    }

    const scores = await Score.find(query)
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .populate('challengeId', 'prompt options');

    const stats = {
      total: scores.length,
      correct: scores.filter(s => s.isCorrect).length,
      totalXP: scores.reduce((sum, s) => sum + s.xp, 0),
      totalCoins: scores.reduce((sum, s) => sum + s.coins, 0),
      currentStreak: 0,
      bestStreak: 0
    };

    // Calculate streaks
    let currentStreak = 0;
    let bestStreak = 0;
    for (const score of scores) {
      if (score.isCorrect) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    stats.currentStreak = currentStreak;
    stats.bestStreak = bestStreak;

    res.json({
      ok: true,
      data: {
        scores,
        stats
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

module.exports = router;
