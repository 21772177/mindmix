const functions = require('firebase-functions');

// Reuse the existing Express app
const app = require('../backend/server');

exports.api = functions
  .runWith({ memory: '512MB', timeoutSeconds: 60 })
  .https.onRequest(app);


