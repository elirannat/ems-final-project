const mongoose = require('mongoose');

const model = mongoose.model('OauthClient', {
    _id: mongoose.Schema.Types.ObjectId,
    clientId: { type: String, alias: "id" },
    clientSecret: { type: String },
    grants: { type: Array },
    redirectUris: { type: Array },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
});

module.exports = model;
