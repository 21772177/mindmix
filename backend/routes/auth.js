const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { findUserByEmail, createUser, comparePassword, getUserById, isFirebaseEnabled } = require('../services/userStore');
const router = express.Router();

// Check if database is connected
const isDBConnected = () => mongoose.connection.readyState === 1;

// @route   POST /auth/register
// @desc    Register user - REAL DATABASE
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

    // Check if database is connected
    if (!isDBConnected()) {
      console.log('⚠️ Database not connected, using DEMO mode');
      // Fallback to demo mode
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
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        ok: false,
        error: 'User already exists with this email'
      });
    }

    // Create new user
    const user = await createUser({ name, email, password });

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'demo-secret-key-change-in-production'
    );

    console.log('✅ NEW USER REGISTERED:', email);

    return res.json({
      ok: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          stats: user.stats
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ ok: false, error: 'Server error: ' + error.message });
  }
});

// @route   POST /auth/login
// @desc    Login user - REAL DATABASE
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
    
    // Check if database is connected
    if (!isDBConnected()) {
      console.log('⚠️ Database not connected, using DEMO mode');
      // Fallback to demo mode
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
    }

    // Find user in database
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isMatch = await comparePassword(user, password);
    if (!isMatch) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid credentials'
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'demo-secret-key-change-in-production'
    );

    console.log('✅ USER LOGGED IN:', email);

    return res.json({
      ok: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          stats: user.stats
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ ok: false, error: 'Server error: ' + error.message });
  }
});

// @route   GET /auth/me
// @desc    Get current user
// @access  Private
router.get('/me', require('../middleware/auth').protect, async (req, res) => {
  try {
    if (!isDBConnected() && !isFirebaseEnabled()) {
      return res.status(503).json({
        ok: false,
        error: 'Database not connected.',
        demo: true
      });
    }
    const user = await getUserById(req.user.id);

    res.json({
      ok: true,
      data: {
        user: {
          id: user.id,
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
