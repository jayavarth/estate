const mongoose = require('mongoose');

const rentSchema = new mongoose.Schema({
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
        enum: ['Yes', 'No'],
        required: true
    },
    images: [String] // Assuming image URLs will be stored as strings
});

const Rental = mongoose.model('Rent', rentSchema);

module.exports = { Rental };
