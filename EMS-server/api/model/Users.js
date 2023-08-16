const mongoose = require('mongoose');

const model = mongoose.model('Users', {
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String },
    password: { type: String, required: true },
    // type: { type: String },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    empCode: { type: String },
    type: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: Number },
    address: { type: String },
    joiningDate: { type: Date },
    resignDate: { type: Date },
    qualification: { type: String },
    panNumber: { type: String },
    designation: { type: String },
    basicSalary: { type: Number },
    gender: { type: String },
    profilePic: { type: String },
    status: { type: String },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    createdAt: { type: Date },
    updatedAt: { type: Date }
});

module.exports = model;