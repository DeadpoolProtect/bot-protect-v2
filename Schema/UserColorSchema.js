const mongoose = require('mongoose');

const UserColorSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#FF0000', 
  },
});

module.exports = mongoose.model('UserColor', UserColorSchema);
