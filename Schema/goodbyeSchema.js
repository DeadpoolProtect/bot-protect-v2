const mongoose = require("mongoose");

const goodbyeSchema = new mongoose.Schema({
  guildid: {
    type: String,
    required: true,
    unique: true,
  },
  channel: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Goodbye", goodbyeSchema);
