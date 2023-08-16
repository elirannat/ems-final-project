const mongoose = require('mongoose');

const model = mongoose.model('CompanyLeave', {
    _id: mongoose.Schema.Types.ObjectId,
    leaveType: { type: String, required: true },
    leaveAlias: { type: String },
    noOfLeave: { type: Number, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    status: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    masterLeaveId: { type: mongoose.Schema.Types.ObjectId, ref: 'MasterLeave' },
});
module.exports = model;