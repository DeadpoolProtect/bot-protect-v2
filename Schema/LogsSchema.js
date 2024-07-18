const mongoose = require('mongoose');

const LogsSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  logsChannels: {
    type: Map,
    of: String,
    default: new Map(),
  },
});

module.exports = mongoose.model('Logs', LogsSchema);
