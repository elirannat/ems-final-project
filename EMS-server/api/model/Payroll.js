const mongoose = require('mongoose');

const model = mongoose.model('Payroll', {
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: Number },
    year: { type: Number },
    totalWorkingDays: { type: Number },
    leave: { type: Number },
    basicSalary: { type: Number },
    allowance: { type: Number },
    deductions: { type: Number },
    netSalary: { type: Number },
    description: { type: String },
    status: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
});

module.exports = model;