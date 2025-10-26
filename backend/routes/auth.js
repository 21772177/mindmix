const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const router = express.Router();

// Check if database is connected
const isDBConnected = () => mongoose.connection.readyState === 1;

// @route   POST /auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({
        ok: false,
        error: 'Database not connected. Demo mode - cannot register users.',
        demo: true
      });
    }
    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Please provide name, email, and password' 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ 
        ok: false, 
        error: 'User already exists' 
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    res.status(201).json({
      ok: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// @route   POST /auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    // Always allow demo/login for testing (database optional)
    console.log('📝 Login attempt - DB status:', isDBConnected() ? 'Connected' : 'Demo mode');
    
    if (!isDBConnected()) {
      // In demo mode, create a mock user
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          ok: false, 
          error: 'Please provide email and password' 
        });
      }
      
      // Create demo user token
      const token = jwt.sign(
        { 
          id: 'demo-user-123', 
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
            id: 'demo-user-123',
            name: 'Demo User',
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
    }
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Please provide email and password' 
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ 
        ok: false, 
        error: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    res.json({
      ok: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
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
