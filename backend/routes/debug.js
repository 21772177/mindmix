const express = require('express');
const router = express.Router();
const errorLogger = require('../utils/errorLogger');
const { protect } = require('../middleware/auth');

// @route   GET /debug/errors
// @desc    Get recent errors (requires auth)
// @access  Private
router.get('/errors', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const errors = await errorLogger.getRecentErrors(limit);
    
    res.json({
      ok: true,
      data: {
        errors,
        count: errors.length
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// @route   GET /debug/stats
// @desc    Get error statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const stats = await errorLogger.getErrorStats();
    
    res.json({
      ok: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// @route   GET /debug/health
// @desc    System health check with diagnostics
// @access  Public
router.get('/health', async (req, res) => {
  const health = {
    ok: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    services: {
      database: false,
      openai: false,
      storage: false
    }
  };

  // Check MongoDB
  try {
    const mongoose = require('mongoose');
    health.services.database = mongoose.connection.readyState === 1;
  } catch (err) {
    // Not connected
  }

  // Check OpenAI
  try {
    health.services.openai = !!(process.env.OPENAI_API_KEY && 
                                process.env.OPENAI_API_KEY !== 'your-openai-api-key-here');
  } catch (err) {
    // Not configured
  }

  // Check storage
  try {
    const fs = require('fs');
    const logDir = require('path').join(__dirname, '../../logs');
    health.services.storage = fs.existsSync(logDir);
  } catch (err) {
    // Not available
  }

  res.json(health);
});

module.exports = router;
