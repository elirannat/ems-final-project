const mongoose = require('mongoose');

const model = mongoose.model('CompanySalary', {
    _id: mongoose.Schema.Types.ObjectId,
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    salaryType: { type: String, required: true },
    amount: { type: String },
    payAs: { type: String },
    payType: { type: String },
    status: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    masterSalaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'MasterSalary' },
});
module.exports = model;