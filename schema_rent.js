const mongoose = require('mongoose');

const rentSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true
    },
    propertyType: {
        type: String,
        required: true
    },
    buildingType: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    streetName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    areaOccupied: {
        type: Number,
        required: true
    },
    monthlyRent: {
        type: Number,
        required: true
    },
    securityDeposit: {
        type: Number,
        required: true
    },
    ageOfProperty: {
        type: Number,
        required: true
    },
    parkingOption: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Rental = mongoose.model('Rent', rentSchema);

module.exports = { Rental };
