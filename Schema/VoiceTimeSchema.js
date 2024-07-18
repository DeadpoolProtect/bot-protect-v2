const mongoose = require('mongoose');

const voiceTimeSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  timeInVoice: { type: Number, default: 0 },
  lastJoinTime: { type: Number, default: null }, 
});

module.exports = mongoose.model('VoiceTime', voiceTimeSchema);
