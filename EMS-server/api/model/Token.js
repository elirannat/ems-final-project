const mongoose = require('mongoose');

const model = mongoose.model('Token', {
    _id: mongoose.Schema.Types.ObjectId,
    accessToken: { type: String },
    accessTokenExpiresAt: { type: Date },
    refreshToken: { type: String },
    refreshTokenExpiresAt: { type: Date },
    scope: { type: Array },
    clientId: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    status: { type: String },
});

module.exports = model;
