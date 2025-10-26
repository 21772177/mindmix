const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Group = require('../models/Group');
const User = require('../models/User');

// @route   POST /groups/create
// @desc    Create a new group
// @access  Private
router.post('/create', protect, async (req, res) => {
  try {
    const { name, challengeType, difficulty, maxMembers, isPrivate } = req.body;
    
    // Generate unique code
    let code, isAvailable;
    do {
      code = Group.generateCode();
      isAvailable = await Group.isCodeAvailable(code);
    } while (!isAvailable);

    // Create group
    const group = await Group.create({
      name: name || `${req.user.name}'s Game`,
      code,
      createdBy: req.user.id,
      members: [{
        userId: req.user.id,
        score: 0
      }],
      challengeType: challengeType || 'music',
      difficulty: difficulty || 'easy',
      maxMembers: maxMembers || 10,
      isPrivate: isPrivate || false,
      status: 'waiting'
    });

    res.status(201).json({
      ok: true,
      data: { group }
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to create group' 
    });
  }
});

// @route   POST /groups/join
// @desc    Join a group by code
// @access  Private
router.post('/join', protect, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Please provide a group code' 
      });
    }

    const group = await Group.findOne({ code: code.toUpperCase() })
      .populate('createdBy', 'name')
      .populate('members.userId', 'name email');

    if (!group) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Group not found' 
      });
    }

    // Check if already a member
    const isMember = group.members.some(m => m.userId._id.toString() === req.user.id);
    
    if (isMember) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Already a member of this group' 
      });
    }

    // Check if group is full
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Group is full' 
      });
    }

    // Check if game has started
    if (group.status !== 'waiting') {
      return res.status(400).json({ 
        ok: false, 
        error: 'Game has already started' 
      });
    }

    // Add member
    group.members.push({
      userId: req.user.id,
      score: 0
    });

    await group.save();

    res.json({
      ok: true,
      data: { group }
    });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to join group' 
    });
  }
});

// @route   GET /groups/:code
// @desc    Get group details
// @access  Public
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const group = await Group.findOne({ code: code.toUpperCase() })
      .populate('createdBy', 'name email')
      .populate('members.userId', 'name email')
      .populate('currentChallenge');

    if (!group) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Group not found' 
      });
    }

    res.json({
      ok: true,
      data: { group }
    });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to get group' 
    });
  }
});

// @route   POST /groups/:code/start
// @desc    Start group challenge (only creator)
// @access  Private
router.post('/:code/start', protect, async (req, res) => {
  try {
    const { code } = req.params;

    const group = await Group.findOne({ code: code.toUpperCase() });

    if (!group) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Group not found' 
      });
    }

    // Check if user is creator
    if (group.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        ok: false, 
        error: 'Only the creator can start the game' 
      });
    }

    // Check if game already started
    if (group.status !== 'waiting') {
      return res.status(400).json({ 
        ok: false, 
        error: 'Game already started' 
      });
    }

    // Update status
    group.status = 'playing';
    group.startedAt = new Date();

    await group.save();

    res.json({
      ok: true,
      message: 'Game started',
      data: { group }
    });
  } catch (error) {
    console.error('Start group error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to start game' 
    });
  }
});

// @route   POST /groups/:code/submit-answer
// @desc    Submit answer for group challenge
// @access  Private
router.post('/:code/submit-answer', protect, async (req, res) => {
  try {
    const { code } = req.params;
    const { challengeId, answer, timeTaken } = req.body;

    const group = await Group.findOne({ code: code.toUpperCase() });

    if (!group) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Group not found' 
      });
    }

    // Check if game is playing
    if (group.status !== 'playing') {
      return res.status(400).json({ 
        ok: false, 
        error: 'Game is not in progress' 
      });
    }

    // Find member
    const member = group.members.find(m => m.userId.toString() === req.user.id);
    
    if (!member) {
      return res.status(403).json({ 
        ok: false, 
        error: 'Not a member of this group' 
      });
    }

    // Store answer (you can enhance this with actual challenge checking)
    const challengeData = {
      challengeId,
      answer,
      timeTaken,
      submittedAt: new Date()
    };

    if (!member.answers) {
      member.answers = new Map();
    }
    member.answers.set(challengeId, challengeData);

    // Update score (this is a placeholder - enhance with actual scoring)
    if (answer) {
      member.score += 10;
    }

    await group.save();

    res.json({
      ok: true,
      data: {
        member,
        message: 'Answer submitted'
      }
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to submit answer' 
    });
  }
});

// @route   GET /groups/list/public
// @desc    Get list of public groups
// @access  Public
router.get('/list/public', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const groups = await Group.find({ 
      isPrivate: false,
      status: 'waiting'
    })
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    res.json({
      ok: true,
      data: { groups }
    });
  } catch (error) {
    console.error('List groups error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to list groups' 
    });
  }
});

module.exports = router;
