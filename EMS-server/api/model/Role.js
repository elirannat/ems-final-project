const mongoose = require('mongoose');

const model = mongoose.model('Role', {
    _id: mongoose.Schema.Types.ObjectId,
    roleName: { type: String, required: true },
    status: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    description: { type: String },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
});

module.exports = model;