const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /stats/user
// @desc    Get user stats
// @access  Private
router.get('/user', require('../middleware/auth').protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    res.json({
      ok: true,
      data: {
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// @route   POST /stats/update
// @desc    Update user stats
// @access  Private
router.post('/update', require('../middleware/auth').protect, async (req, res) => {
  try {
    const { type, correct } = req.body; // type: 'beatrush', 'learn', correct: true/false
    
    // Input validation
    if (typeof correct !== 'boolean') {
      return res.status(400).json({ ok: false, error: 'Invalid input: correct must be boolean' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    if (correct) {
      user.stats.totalPoints += 10;
      user.stats.correctAnswers += 1;
      user.stats.streak += 1;
      
      // Update highest streak
      if (user.stats.streak > user.stats.highestStreak) {
        user.stats.highestStreak = user.stats.streak;
      }
      
      // Calculate level (every 100 points = 1 level)
      user.stats.level = Math.floor(user.stats.totalPoints / 100) + 1;
    } else {
      user.stats.wrongAnswers += 1;
      user.stats.streak = 0;
    }

    await user.save();

    res.json({
      ok: true,
      data: {
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

module.exports = router;

