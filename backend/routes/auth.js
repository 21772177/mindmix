const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const router = express.Router();

// Check if database is connected
const isDBConnected = () => mongoose.connection.readyState === 1;

// @route   POST /auth/register
// @desc    Register user - DEMO MODE (no database required)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Please provide name, email, and password' 
      });
    }

    // DEMO MODE: Always allow registration without database
    console.log('✅ REGISTER: Allowing access for:', email);
    
    // Create demo user token
    const token = jwt.sign(
      { 
        id: 'demo-' + Date.now(), 
        email: email,
        demo: true 
      },
      process.env.JWT_SECRET || 'demo-secret-key-change-in-production'
    );
    
    return res.json({
      ok: true,
      data: {
        token,
        user: {
          id: 'demo-user-' + Date.now(),
          name: name || email.split('@')[0],
          email: email,
          demo: true,
          stats: {
            totalPoints: 0,
            level: 1,
            correctAnswers: 0,
            wrongAnswers: 0
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// @route   POST /auth/login
// @desc    Login user - DEMO MODE (no database required)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Please provide email and password' 
      });
    }
    
    // DEMO MODE: Always allow login without database
    console.log('✅ LOGIN: Allowing access for:', email);
    
    // Create demo user token
    const token = jwt.sign(
      { 
        id: 'demo-' + Date.now(), 
        email: email,
        demo: true 
      },
      process.env.JWT_SECRET || 'demo-secret-key-change-in-production'
    );
    
    return res.json({
      ok: true,
      data: {
        token,
        user: {
          id: 'demo-user-' + Date.now(),
          name: email.split('@')[0],
          email: email,
          demo: true,
          stats: {
            totalPoints: 0,
            level: 1,
            correctAnswers: 0,
            wrongAnswers: 0
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// @route   GET /auth/me
// @desc    Get current user
// @access  Private
router.get('/me', require('../middleware/auth').protect, async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({
        ok: false,
        error: 'Database not connected.',
        demo: true
      });
    }
    
    const user = await User.findById(req.user.id);

    res.json({
      ok: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          challengesCreated: user.challengesCreated,
          challengesCompleted: user.challengesCompleted
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

module.exports = router;
