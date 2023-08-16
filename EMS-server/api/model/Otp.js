const mongoose = require('mongoose');

const model = mongoose.model('Otp', {
    _id: mongoose.Schema.Types.ObjectId,
    otp: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    expiredAt: { type: Date }
});

module.exports = model;
