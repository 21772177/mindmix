const jwt = require('jsonwebtoken');
const { getUserById } = require('../services/userStore');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (Mongo or Firestore via userStore)
      const user = await getUserById(decoded.id);
      req.user = user ? { id: user.id, email: user.email, name: user.name } : null;

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
