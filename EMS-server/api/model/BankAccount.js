const mongoose = require('mongoose');

const model = mongoose.model('BankAccount', {
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accHolderName: { type: String },
    bankAccountNumber: { type: Number },
    bankName: { type: String },
    bankBranch: { type: String },
    ifscCode: { type: String },
    checkImg: { type: String },
    status: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
});

module.exports = model;
