const express = require('express');
const router = express.Router();
const { getAdmin, isFirebaseEnabled } = require('../config/firebase');
const { protect } = require('../middleware/auth');

// GET /media/sign?path=audio/clip.mp3
router.get('/sign', protect, async (req, res) => {
  try {
    if (!isFirebaseEnabled()) {
      return res.status(503).json({ ok: false, error: 'Firebase not configured' });
    }
    const { path } = req.query;
    if (!path) return res.status(400).json({ ok: false, error: 'path is required' });

    const admin = getAdmin();
    const bucket = admin.storage().bucket();
    const file = bucket.file(path);

    const [exists] = await file.exists();
    if (!exists) return res.status(404).json({ ok: false, error: 'File not found' });

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000 // 1 hour
    });

    res.json({ ok: true, url });
  } catch (err) {
    console.error('Media sign error:', err);
    res.status(500).json({ ok: false, error: 'Failed to sign URL' });
  }
});

module.exports = router;


