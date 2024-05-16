const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    ownerType: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    propertyType: {
        type: String,
        required: true
    },
    buildingType: {
        type: String,
        required: true
    },
    cost: { 
        type: String,
        required: true
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = { Listing };
