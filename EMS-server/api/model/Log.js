const mongoose = require('mongoose');

const model = mongoose.model('Log', {
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    logLevel: { type: String },
    module: { type: String },
    operationType: { type: String },
    message: { type: String },
    moduleId: { type: mongoose.Schema.Types.ObjectId },
    oldData: { type: Object },
    newData: { type: Object },
    status: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date }
});

module.exports = model;
