const mongoose = require('mongoose');

const antimassmentionSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  enabled: { type: Boolean, default: false },
  mentionLimit: { type: Number, default: 5 }, // Par défaut, 5 mentions maximum
  timeoutDuration: { type: Number, default: 600 } // Par défaut, 10 minutes
});

module.exports = mongoose.model('Antimassmention', antimassmentionSchema);
