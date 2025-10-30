const jwt = require('jsonwebtoken');
const { getUserById } = require('../services/userStore');
const { getAdmin, isFirebaseEnabled } = require('../config/firebase');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Prefer Firebase ID tokens if available, otherwise use app JWT
      let userPayload = null;
      if (isFirebaseEnabled()) {
        try {
          const admin = getAdmin();
          const fbDecoded = await admin.auth().verifyIdToken(token);
          userPayload = { id: fbDecoded.uid, email: fbDecoded.email, name: fbDecoded.name };
        } catch (_) {
          // Not a Firebase token or verification failed; will try app JWT next
        }
      }
      if (!userPayload) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await getUserById(decoded.id);
        userPayload = user ? { id: user.id, email: user.email, name: user.name } : null;
      }
      req.user = userPayload;

      if (!req.user) {
        return res.status(401).json({ ok: false, error: 'User not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ ok: false, error: 'Not authorized' });
    }
  } else {
    return res.status(401).json({ ok: false, error: 'Not authorized, no token' });
  }
};

module.exports = { protect };
