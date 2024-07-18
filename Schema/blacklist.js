const { model, Schema } = require('mongoose');

const BlacklistSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: String,
        required: true,
        trim: true,
    },
    reason: {
        type: String,
        default: 'No reason provided',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
});

module.exports = model('Blacklist', BlacklistSchema);
