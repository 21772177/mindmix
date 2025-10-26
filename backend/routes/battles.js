const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Battle = require('../models/Battle');
const User = require('../models/User');

// @route   POST /battles/create
// @desc    Create a new battle
// @access  Private
router.post('/create', protect, async (req, res) => {
  try {
    const { name, challengeType, difficulty, challengeCount, timeLimit } = req.body;
    
    // Generate unique code
    let code, isAvailable;
    do {
      code = Battle.generateCode();
      isAvailable = await Battle.isCodeAvailable(code);
    } while (!isAvailable);

    // Create battle
    const battle = await Battle.create({
      name: name || `${req.user.name}'s Battle`,
      code,
      host: req.user.id,
      participants: [{
        userId: req.user.id,
        score: 0
      }],
      challengeType: challengeType || 'mixed',
      difficulty: difficulty || 'easy',
      challengeCount: challengeCount || 5,
      timeLimit: timeLimit || 60,
      status: 'waiting'
    });

    res.status(201).json({
      ok: true,
      data: { battle }
    });
  } catch (error) {
    console.error('Create battle error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to create battle' 
    });
  }
});

// @route   POST /battles/join
// @desc    Join a battle
// @access  Private
router.post('/join', protect, async (req, res) => {
  try {
    const { code } = req.body;

    const battle = await Battle.findOne({ code: code.toUpperCase() })
      .populate('participants.userId', 'name email');

    if (!battle) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Battle not found' 
      });
    }

    // Check if already a participant
    const isParticipant = battle.participants.some(p => 
      p.userId._id.toString() === req.user.id
    );
    
    if (isParticipant) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Already in this battle' 
      });
    }

    // Check battle status
    if (battle.status !== 'waiting') {
      return res.status(400).json({ 
        ok: false, 
        error: 'Battle already started' 
      });
    }

    // Add participant
    battle.participants.push({
      userId: req.user.id,
      score: 0
    });

    await battle.save();

    res.json({
      ok: true,
      data: { battle }
    });
  } catch (error) {
    console.error('Join battle error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to join battle' 
    });
  }
});

// @route   GET /battles/:code
// @desc    Get battle details
// @access  Public
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const battle = await Battle.findOne({ code: code.toUpperCase() })
      .populate('host', 'name email')
      .populate('participants.userId', 'name email')
      .populate('winner', 'name');

    if (!battle) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Battle not found' 
      });
    }

    res.json({
      ok: true,
      data: { battle }
    });
  } catch (error) {
    console.error('Get battle error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to get battle' 
    });
  }
});

// @route   GET /battles/:code/leaderboard
// @desc    Get live leaderboard
// @access  Public
router.get('/:code/leaderboard', async (req, res) => {
  try {
    const { code } = req.params;

    const battle = await Battle.findOne({ code: code.toUpperCase() })
      .populate('participants.userId', 'name email');

    if (!battle) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Battle not found' 
      });
    }

    const leaderboard = battle.getLiveLeaderboard()
      .map(p => ({
        rank: p.rank,
        userId: p.userId,
        name: battle.participants.find(participant => 
          participant.userId._id.toString() === p.userId.toString()
        )?.userId?.name || 'Unknown',
        score: p.score,
        correctCount: p.correctCount
      }));

    res.json({
      ok: true,
      data: { leaderboard, status: battle.status }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to get leaderboard' 
    });
  }
});

// @route   POST /battles/:code/start
// @desc    Start battle (only host)
// @access  Private
router.post('/:code/start', protect, async (req, res) => {
  try {
    const { code } = req.params;

    const battle = await Battle.findOne({ code: code.toUpperCase() });

    if (!battle) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Battle not found' 
      });
    }

    // Check if user is host
    if (battle.host.toString() !== req.user.id) {
      return res.status(403).json({ 
        ok: false, 
        error: 'Only the host can start the battle' 
      });
    }

    // Check battle status
    if (battle.status !== 'waiting') {
      return res.status(400).json({ 
        ok: false, 
        error: 'Battle already started' 
      });
    }

    // Update status
    battle.status = 'starting';
    battle.startedAt = new Date();

    await battle.save();

    // Generate challenges (using mock for now)
    // In production, generate real challenges

    res.json({
      ok: true,
      message: 'Battle starting',
      data: { battle }
    });
  } catch (error) {
    console.error('Start battle error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to start battle' 
    });
  }
});

// @route   POST /battles/:code/submit-answer
// @desc    Submit answer for battle
// @access  Private
router.post('/:code/submit-answer', protect, async (req, res) => {
  try {
    const { code } = req.params;
    const { challengeId, answer, timeTaken } = req.body;

    const battle = await Battle.findOne({ code: code.toUpperCase() });

    if (!battle) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Battle not found' 
      });
    }

    if (battle.status !== 'active') {
      return res.status(400).json({ 
        ok: false, 
        error: 'Battle is not active' 
      });
    }

    // Find participant
    const participant = battle.participants.find(p => 
      p.userId.toString() === req.user.id
    );
    
    if (!participant) {
      return res.status(403).json({ 
        ok: false, 
        error: 'Not a participant' 
      });
    }

    // Submit answer
    participant.answers.push({
      challengeId,
      answer,
      isCorrect: true, // Calculate based on challenge
      timeTaken,
      submittedAt: new Date()
    });

    // Update score
    participant.score += 10;

    await battle.save();

    res.json({
      ok: true,
      data: {
        score: participant.score,
        rank: battle.getLiveLeaderboard().findIndex(p => 
          p.userId.toString() === req.user.id
        ) + 1
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

// @route   GET /battles/list/public
// @desc    Get list of public battles
// @access  Public
router.get('/list/public', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const battles = await Battle.find({ 
      status: 'waiting'
    })
    .populate('host', 'name')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    res.json({
      ok: true,
      data: { battles }
    });
  } catch (error) {
    console.error('List battles error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to list battles' 
    });
  }
});

module.exports = router;
