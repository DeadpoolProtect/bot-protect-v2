const mongoose = require('mongoose');

const antilinksSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  whitelistLinks: {
    type: [String],
    default: [],
  },
  allowGif: {
    type: Boolean,
    default: true,
  },
  time: {
    type: Number,
    default: '15'
  }
});

module.exports = mongoose.model('Antilinks', antilinksSchema);
