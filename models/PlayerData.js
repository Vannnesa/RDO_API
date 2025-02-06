const mongoose = require('mongoose');

const PlayerDataSchema = new mongoose.Schema({
  playerid: { type: String, required: true, unique: true },
  lastUpdated: { type: Date, default: Date.now },
  data: { type: Object, required: true }
});

module.exports = mongoose.model('PlayerData', PlayerDataSchema);