const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Friend = require('../models/Friend');
const User = require('../models/User');

// @route   GET /friends
// @desc    Get user's friends
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const friends = await Friend.getFriends(req.user.id);
    res.json({ ok: true, data: { friends } });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ ok: false, error: 'Failed to get friends' });
  }
});

// @route   POST /friends/request
// @desc    Send friend request
// @access  Private
router.post('/request', protect, async (req, res) => {
  try {
    const { userId } = req.body;

    if (req.user.id === userId) {
      return res.status(400).json({ ok: false, error: 'Cannot friend yourself' });
    }

    // Check if request already exists
    const existing = await Friend.findOne({
      $or: [
        { requester: req.user.id, recipient: userId },
        { requester: userId, recipient: req.user.id }
      ]
    });

    if (existing) {
      return res.status(400).json({ ok: false, error: 'Friend request already exists' });
    }

    const friend = await Friend.create({
      requester: req.user.id,
      recipient: userId,
      status: 'pending'
    });

    res.status(201).json({ ok: true, data: { friend } });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ ok: false, error: 'Failed to send friend request' });
  }
});

// @route   POST /friends/accept
// @desc    Accept friend request
// @access  Private
router.post('/accept', protect, async (req, res) => {
  try {
    const { requestId } = req.body;

    const friendRequest = await Friend.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ ok: false, error: 'Friend request not found' });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ ok: false, error: 'Not authorized' });
    }

    friendRequest.status = 'accepted';
    await friendRequest.save();

    res.json({ ok: true, data: { friend: friendRequest } });
  } catch (error) {
    console.error('Accept friend error:', error);
    res.status(500).json({ ok: false, error: 'Failed to accept friend request' });
  }
});

// @route   GET /friends/pending
// @desc    Get pending friend requests
// @access  Private
router.get('/pending', protect, async (req, res) => {
  try {
    const pending = await Friend.find({
      recipient: req.user.id,
      status: 'pending'
    })
    .populate('requester', 'name email');

    res.json({ ok: true, data: { requests: pending } });
  } catch (error) {
    console.error('Get pending error:', error);
    res.status(500).json({ ok: false, error: 'Failed to get pending requests' });
  }
});

module.exports = router;
