const express = require('express');
const router = express.Router();
const { getUserById, updateStats } = require('../services/userStore');

// @route   GET /stats/user
// @desc    Get user stats
// @access  Private
router.get('/user', require('../middleware/auth').protect, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    
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
    
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }
    const newStats = await updateStats(req.user.id, !!correct);

    res.json({
      ok: true,
      data: {
        stats: newStats || user.stats
      }
    });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

module.exports = router;

