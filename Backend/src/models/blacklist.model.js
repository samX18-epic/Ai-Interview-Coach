const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const tokenBlacklistModel = mongoose.model('Blacklist', blacklistTokenSchema);

module.exports = tokenBlacklistModel;