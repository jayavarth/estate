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
    cost: {
        type: String,
        required: true
    },
    detailedAddress: {
        type: String,
        required: true
    },
    nearbyFacilities: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = { Listing };
