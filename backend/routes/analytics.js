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
      .select('name email totalXP coins level stage rankings stats')
      .sort({ 'stats.totalPoints': -1 }) // Sort by new stats system
      .limit(parseInt(limit));

    // Add ranking positions
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      totalPoints: user.stats?.totalPoints || 0,
      correctAnswers: user.stats?.correctAnswers || 0,
      level: user.stats?.level || user.level || 1,
      streak: user.stats?.streak || 0,
      score: user.stats?.totalPoints || 0 // Use new stats for ranking
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
    
    // Get user from database with stats
    const user = await User.findById(userId).select('name totalXP coins level stage rankings challengesCompleted stats');

    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    // Use stats from user.stats (new stats system) or fallback to old fields
    const stats = {
      totalPoints: user.stats?.totalPoints || 0,
      correctAnswers: user.stats?.correctAnswers || 0,
      wrongAnswers: user.stats?.wrongAnswers || 0,
      level: user.stats?.level || user.level || 1,
      stage: user.stage || 1,
      streak: user.stats?.streak || 0,
      highestStreak: user.stats?.highestStreak || 0,
      categories: user.stats?.categories || {}
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
