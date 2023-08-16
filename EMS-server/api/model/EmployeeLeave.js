const mongoose = require('mongoose');

const model = mongoose.model('EmployeeLeave', {
    _id: mongoose.Schema.Types.ObjectId,
    leaveId: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyLeave', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateFrom: { type: String, required: true },
    dateTo: { type: String, required: true },
    noOfLeave: { type: Number, required: true },
    status: { type: String },
    reason: { type: String },
    approvedRejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date }
});

module.exports = model;