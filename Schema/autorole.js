const mongoose = require('mongoose');

const autoroleSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  role: { type: String, required: true },
  enabled: { type: Boolean, default: false }
});

module.exports = mongoose.model('Autorole', autoroleSchema);
