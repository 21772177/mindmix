const errorLogger = require('../utils/errorLogger');

const errorHandler = (err, req, res, next) => {
  // Log the error
  const context = {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
    body: req.body
  };

  errorLogger.logError(err, context).then(errorData => {
    // Send appropriate response based on severity
    if (errorData.severity === 'CRITICAL') {
      res.status(500).json({
        ok: false,
        error: 'Server error. Please try again later.',
        errorId: errorData.timestamp,
        timestamp: errorData.timestamp
      });
    } else if (errorData.severity === 'HIGH') {
      res.status(400).json({
        ok: false,
        error: err.message || 'Request failed',
        timestamp: errorData.timestamp
      });
    } else {
      res.status(500).json({
        ok: false,
        error: err.message || 'An error occurred',
        timestamp: errorData.timestamp
      });
    }
  });
};

module.exports = errorHandler;
