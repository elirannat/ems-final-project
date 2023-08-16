const mongoose = require('mongoose');

const model = mongoose.model('Appraisal', {
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    firstName: { type: String },
    lastName: { type: String },
    dayFrom: { type: Date },
    dayTo: { type: Date },
    percentage: { type: Number },
    previousSalary: { type: Number },
    newSalary: { type: Number, required: true },
    status: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date }
});

module.exports = model;
