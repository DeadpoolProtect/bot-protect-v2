const { Schema, model } = require('mongoose');

const warningSchema = new Schema({
  GuildID: {
    type: String,
    required: true
  },
  UserID: {
    type: String,
    required: true
  },
  UserTag: {
    type: String,
    required: true
  },
  Content: {
    type: Array,
    required: true
  }
});

module.exports = model('Warning', warningSchema);
