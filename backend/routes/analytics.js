const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Score = require('../models/Score');

// @route   GET /analytics/summary
// @desc    Get analytics summary
// @access  Public
router.get('/summary', async (req, res) => {
  try {
    const last = await Analytics.find().sort({ date: -1 }).limit(30);
    res.json({ ok: true, data: last });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// @route   GET /analytics/leaderboard
// @desc    Get global leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'global', limit = 50 } = req.query;
    
    let sortField = 'totalXP';
    if (type !== 'global') {
      sortField = `rankings.${type}`;
    }

    const users = await User.find()
      .select('name email totalXP coins level stage rankings')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    // Add ranking positions
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      totalXP: user.totalXP || 0,
      coins: user.coins || 0,
      level: user.level || 1,
      stage: user.stage || 1,
      score: type === 'global' ? user.totalXP : user.rankings[type] || 0
    }));

    res.json({
      ok: true,
      data: {
        type,
        leaderboard,
        total: users.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// @route   GET /analytics/stats/:userId
// @desc    Get user statistics
// @access  Public
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user
    const user = await User.findById(userId)
      .select('name totalXP coins level stage rankings challengesCompleted');

    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    // Get score statistics
    const scores = await Score.find({ userId })
      .populate('challengeId')
      .sort({ completedAt: -1 })
      .limit(50);

    // Calculate statistics
    const stats = {
      totalChallenges: user.challengesCompleted || 0,
      totalXP: user.totalXP || 0,
      coins: user.coins || 0,
      level: user.level || 1,
      stage: user.stage || 1,
      streak: user.streak || 0,
      recentChallenges: scores.length,
      categories: {
        music: scores.filter(s => s.challengeType === 'music').length,
        logic: scores.filter(s => s.challengeType === 'logic').length,
        trivia: scores.filter(s => s.challengeType === 'trivia').length,
        creative: scores.filter(s => s.challengeType === 'creative').length,
        math: scores.filter(s => s.challengeType === 'math').length
      }
    };

    res.json({
      ok: true,
      data: stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

module.exports = router;
