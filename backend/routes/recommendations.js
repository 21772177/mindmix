const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Score = require('../models/Score');

// @route   GET /recommendations/personalized
// @desc    Get personalized challenge recommendations
// @access  Private
router.get('/personalized', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's challenge history
    const recentScores = await Score.find({ userId })
      .sort({ completedAt: -1 })
      .limit(10);
    
    // Analyze performance
    const performance = {
      strongCategories: [],
      weakCategories: [],
      averageAccuracy: 0
    };
    
    const categoryStats = {};
    recentScores.forEach(score => {
      if (!categoryStats[score.challengeType]) {
        categoryStats[score.challengeType] = { correct: 0, total: 0 };
      }
      categoryStats[score.challengeType].total++;
      if (score.score > 0) categoryStats[score.challengeType].correct++;
    });
    
    // Find strong and weak categories
    Object.keys(categoryStats).forEach(cat => {
      const accuracy = categoryStats[cat].correct / categoryStats[cat].total;
      if (accuracy >= 0.7) {
        performance.strongCategories.push(cat);
      } else if (accuracy < 0.5) {
        performance.weakCategories.push(cat);
      }
      performance.averageAccuracy += accuracy;
    });
    
    performance.averageAccuracy /= Object.keys(categoryStats).length || 1;
    
    // Generate recommendations
    const recommendations = {
      forYou: [],
      trending: [],
      basedOnPerformance: []
    };
    
    // Suggest challenges based on weak areas
    if (performance.weakCategories.length > 0) {
      recommendations.forYou.push({
        type: 'improvement',
        message: `Focus on ${performance.weakCategories[0]} to improve`,
        category: performance.weakCategories[0],
        difficulty: 'medium'
      });
    }
    
    // Suggest next difficulty level
    const user = await User.findById(userId);
    if (user) {
      recommendations.forYou.push({
        type: 'progression',
        message: `Level ${user.level} - Try harder challenges!`,
        suggestedDifficulty: user.level < 20 ? 'easy' : user.level < 50 ? 'medium' : 'hard',
        currentLevel: user.level
      });
    }
    
    // Recommend streak challenges
    if (user.streak >= 5) {
      recommendations.forYou.push({
        type: 'streak',
        message: `🔥 Keep your ${user.streak}-game streak alive!`,
        currentStreak: user.streak
      });
    }
    
    res.json({
      ok: true,
      data: {
        recommendations,
        performance
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ ok: false, error: 'Failed to get recommendations' });
  }
});

// @route   GET /recommendations/trending
// @desc    Get trending challenges
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    // Get most popular categories from analytics
    const trendingCategories = ['music', 'logic', 'trivia'];
    
    res.json({
      ok: true,
      data: {
        categories: trendingCategories,
        message: 'Trending now: Music, Logic, and Trivia challenges'
      }
    });
  } catch (error) {
    console.error('Get trending error:', error);
    res.status(500).json({ ok: false, error: 'Failed to get trending' });
  }
});

module.exports = router;
