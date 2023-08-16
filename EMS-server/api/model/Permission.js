const mongoose = require('mongoose');

const model = mongoose.model('Permission', {
    _id: mongoose.Schema.Types.ObjectId,
    type: { type: String, required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    status: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
});

module.exports = model;
