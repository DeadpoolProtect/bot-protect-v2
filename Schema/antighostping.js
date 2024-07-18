const mongoose = require('mongoose');

const antiGhostPingSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('AntiGhostPing', antiGhostPingSchema);
