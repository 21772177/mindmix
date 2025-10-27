require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Load environment variables
require('dotenv').config();

const app = express();

// Connect to database (async, non-blocking for demo mode)
connectDB().catch(err => {
  console.log('⚠️  Continuing in demo mode without database');
});

// Middleware
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Environment validation
function validateEnv() {
  const required = ['MONGO_URI', 'JWT_SECRET'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    console.warn('Warning: missing required env vars:', missing.join(', '));
  }
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('Warning: OPENAI_API_KEY not set. AI features will not work.');
  }
}
validateEnv();

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/ai', require('./routes/ai'));
app.use('/api/auth', require('./routes/auth')); // Also mount at /api/* for tunnel compatibility
app.use('/api/ai', require('./routes/ai')); // Also mount at /api/* for tunnel compatibility
app.use('/analytics', require('./routes/analytics'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/scores', require('./routes/scores'));
app.use('/api/scores', require('./routes/scores'));
app.use('/groups', require('./routes/groups'));
app.use('/api/groups', require('./routes/groups'));
app.use('/battles', require('./routes/battles'));
app.use('/api/battles', require('./routes/battles'));
app.use('/knowledge', require('./routes/knowledge'));
app.use('/api/knowledge', require('./routes/knowledge'));
app.use('/recommendations', require('./routes/recommendations'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/notifications', require('./routes/notifications').router);
app.use('/api/notifications', require('./routes/notifications').router);
app.use('/friends', require('./routes/friends'));
app.use('/api/friends', require('./routes/friends'));
app.use('/stats', require('./routes/stats'));
app.use('/api/stats', require('./routes/stats'));

// ICE Configuration endpoint
app.get('/config/ice', (req, res) => {
  try {
    if (process.env.ICE_SERVERS_JSON) {
      try {
        const parsed = JSON.parse(process.env.ICE_SERVERS_JSON);
        return res.json({ ok: true, iceServers: parsed });
      } catch (e) {
        console.warn('Invalid ICE_SERVERS_JSON', e);
      }
    }
    
    if (process.env.COTURN_USER && process.env.COTURN_PASS && process.env.COTURN_REALM) {
      const host = process.env.COTURN_HOST || req.hostname || 'your-turn-server.com';
      const port = process.env.COTURN_PORT || '3478';
      const urls = [
        `turn:${host}:${port}?transport=udp`,
        `turn:${host}:${port}?transport=tcp`
      ];
      const ice = [{
        urls,
        username: process.env.COTURN_USER,
        credential: process.env.COTURN_PASS
      }];
      return res.json({ ok: true, iceServers: ice });
    }
  } catch (e) {
    console.warn('ICE config error', e);
  }
  
  // Fallback to Google STUN
  return res.json({
    ok: true,
    iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    message: 'AiLiveChallenge API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    ok: false,
    error: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 4000;

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION:', err);
  require('./utils/errorLogger').logError(err, { type: 'uncaughtException' });
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('⚠️  UNHANDLED REJECTION:', err);
  require('./utils/errorLogger').logError(err, { type: 'unhandledRejection' });
});

const server = app.listen(PORT, () => {
  console.log(`\n🚀 AiLiveChallenge Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎯 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Error logs: backend/logs/\n`);
});

module.exports = app;