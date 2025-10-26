const fs = require('fs');
const path = require('path');

class ErrorLogger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatError(error) {
    return {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      type: error.name,
      severity: this.determineSeverity(error),
      context: error.context || {}
    };
  }

  determineSeverity(error) {
    // Critical errors that stop functionality
    if (error.message.includes('Cannot find module') || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connection refused')) {
      return 'CRITICAL';
    }
    
    // High priority user-facing errors
    if (error.message.includes('quota') || 
        error.message.includes('authentication') ||
        error.message.includes('authorization')) {
      return 'HIGH';
    }
    
    return 'MEDIUM';
  }

  async logError(error, metadata = {}) {
    const errorData = {
      ...this.formatError(error),
      metadata,
      hostname: process.env.HOSTNAME || 'unknown',
      environment: process.env.NODE_ENV || 'development'
    };

    // Log to file
    const filename = `error-${new Date().toISOString().split('T')[0]}.jsonl`;
    const filepath = path.join(this.logDir, filename);
    
    try {
      await fs.promises.appendFile(filepath, JSON.stringify(errorData) + '\n');
    } catch (err) {
      console.error('Failed to write error log:', err);
    }

    // Console log with color coding
    this.logToConsole(errorData);
    
    // Auto-debug critical errors
    if (errorData.severity === 'CRITICAL') {
      this.autoDebug(errorData);
    }

    return errorData;
  }

  logToConsole(errorData) {
    const colors = {
      CRITICAL: '\x1b[31m', // Red
      HIGH: '\x1b[33m',     // Yellow
      MEDIUM: '\x1b[36m',   // Cyan
      reset: '\x1b[0m'
    };

    const color = colors[errorData.severity] || colors.MEDIUM;
    console.error(
      `${color}[${errorData.severity}] ${errorData.timestamp}${colors.reset}`
    );
    console.error(`${color}→ ${errorData.message}${colors.reset}`);
  }

  async autoDebug(errorData) {
    console.log('\n🔍 AUTO-DEBUG STARTED');
    console.log(`Error Type: ${errorData.type}`);
    console.log(`Severity: ${errorData.severity}`);
    console.log(`Time: ${errorData.timestamp}`);
    
    // Auto-suggest fixes
    const suggestions = this.suggestFixes(errorData);
    if (suggestions.length > 0) {
      console.log('\n💡 SUGGESTED FIXES:');
      suggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion}`);
      });
    }
    
    // Auto-solve common issues
    await this.autoSolve(errorData);
  }

  suggestFixes(errorData) {
    const suggestions = [];
    const msg = errorData.message;

    if (msg.includes('Cannot find module')) {
      suggestions.push(`Install missing module: ${msg.match(/Cannot find module '(.+?)'/)?.[1]}`);
      suggestions.push('Run: npm install in backend directory');
    }

    if (msg.includes('ECONNREFUSED') || msg.includes('connection refused')) {
      suggestions.push('Backend server is not running');
      suggestions.push('Start with: cd backend && node server.js');
    }

    if (msg.includes('quota') || msg.includes('429')) {
      suggestions.push('OpenAI API quota exceeded');
      suggestions.push('Add billing: https://platform.openai.com/account/billing');
      suggestions.push('App will auto-use mock data');
    }

    if (msg.includes('MongoDB') || msg.includes('mongoose')) {
      suggestions.push('Check MongoDB connection string in .env');
      suggestions.push('Verify MongoDB Atlas network access');
    }

    return suggestions;
  }

  async autoSolve(errorData) {
    const msg = errorData.message;
    
    // Auto-restart for module errors
    if (msg.includes('Cannot find module') && errorData.context?.restartable) {
      console.log('\n🔄 ATTEMPTING AUTO-FIX...');
      console.log('Restarting server after 2 seconds...');
      // This will be handled by nodemon or pm2 in production
    }
  }

  // Get recent errors for debugging
  async getRecentErrors(limit = 50) {
    const today = new Date().toISOString().split('T')[0];
    const filename = `error-${today}.jsonl`;
    const filepath = path.join(this.logDir, filename);

    if (!fs.existsSync(filepath)) {
      return [];
    }

    try {
      const content = await fs.promises.readFile(filepath, 'utf-8');
      const lines = content.trim().split('\n').filter(Boolean);
      return lines.slice(-limit).map(line => JSON.parse(line));
    } catch (err) {
      return [];
    }
  }

  // Get error statistics
  async getErrorStats() {
    const files = fs.readdirSync(this.logDir)
      .filter(file => file.startsWith('error-'))
      .sort()
      .slice(-7); // Last 7 days

    const stats = {
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      byType: {}
    };

    for (const file of files) {
      const filepath = path.join(this.logDir, file);
      const content = await fs.promises.readFile(filepath, 'utf-8');
      const lines = content.trim().split('\n').filter(Boolean);

      lines.forEach(line => {
        const error = JSON.parse(line);
        stats.total++;
        stats[error.severity.toLowerCase()]++;
        stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      });
    }

    return stats;
  }
}

module.exports = new ErrorLogger();
