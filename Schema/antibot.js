const mongoose = require('mongoose');

const antibotSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    active: { type: Boolean, default: false },
});

module.exports = mongoose.model('Antibot', antibotSchema);
