const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Simple in-memory notifications (in production, use Redis or DB)
const notifications = {};

// @route   GET /notifications
// @desc    Get user notifications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const userNotifications = notifications[userId] || [];
    
    res.json({
      ok: true,
      data: { notifications: userNotifications }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ ok: false, error: 'Failed to get notifications' });
  }
});

// Helper function to add notification
const addNotification = (userId, type, message, data = {}) => {
  if (!notifications[userId]) {
    notifications[userId] = [];
  }
  
  notifications[userId].unshift({
    id: Date.now(),
    type,
    message,
    data,
    read: false,
    createdAt: new Date()
  });
  
  // Keep only last 50 notifications
  if (notifications[userId].length > 50) {
    notifications[userId] = notifications[userId].slice(0, 50);
  }
};

// @route   POST /notifications/read
// @desc    Mark notification as read
// @access  Private
router.post('/read', protect, async (req, res) => {
  try {
    const { notificationId } = req.body;
    const userId = req.user.id;
    
    if (notifications[userId]) {
      const notification = notifications[userId].find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    }
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ ok: false, error: 'Failed to mark as read' });
  }
});

// Export the helper function
module.exports = { router, addNotification };
