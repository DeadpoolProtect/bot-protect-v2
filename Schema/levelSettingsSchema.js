const mongoose = require('mongoose');

const levelSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  enabled: { type: Boolean, default: false },
  channelId: { type: String, default: null },
});

module.exports = mongoose.model('LevelSettings', levelSettingsSchema);
