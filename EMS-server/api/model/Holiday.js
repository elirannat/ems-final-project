const mongoose = require('mongoose');

const model = mongoose.model('Holiday', {
    _id: mongoose.Schema.Types.ObjectId,
    holidayName: { type: String, required: true },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true },
    status: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    
});

module.exports = model;