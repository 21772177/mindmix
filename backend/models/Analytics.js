const mongoose = require('mongoose');
const AnalyticsSchema = new mongoose.Schema({
  date: { type: String },
  challengesGenerated: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
  topCategories: { type: Object, default: {} }
});
module.exports = mongoose.model('Analytics', AnalyticsSchema);
