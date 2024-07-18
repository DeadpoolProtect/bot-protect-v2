const { model, Schema } = require('mongoose');

const SetOwnerSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
});

module.exports = model('SetOwner', SetOwnerSchema);