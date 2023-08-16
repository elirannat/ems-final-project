const mongoose = require('mongoose');

const model = mongoose.model('MasterSalary', {
    _id: mongoose.Schema.Types.ObjectId,
    salaryType: { type: String, required: true },
    addAsDefault: { type: Boolean, required: true },
    status: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
});
module.exports = model;