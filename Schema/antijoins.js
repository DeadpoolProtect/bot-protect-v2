const mongoose = require('mongoose');

const antijoinsSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Antijoins', antijoinsSchema);
