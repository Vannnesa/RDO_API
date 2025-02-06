const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  index: { type: String, required: true, unique: true },
  playerid: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  data: { type: Object, required: true },
  status: { type: String, enum: ['可用', '过期'], default: '可用' }
});

module.exports = mongoose.model('History', HistorySchema);