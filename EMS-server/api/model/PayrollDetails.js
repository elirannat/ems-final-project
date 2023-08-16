const mongoose = require('mongoose');

const model = mongoose.model('PayrollDetails', {
    _id: mongoose.Schema.Types.ObjectId,
    payrollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payroll', required: true },
    salaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanySalary', required: true },
    amount: { type: Number, required: true },
    payAs: { type: String },
    payType: { type: String },
    status: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
});

module.exports = model;