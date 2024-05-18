const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    ownerType: {
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
    landmark: {
        type: String,
        required: true
    },
    streetName: {
        type: String,
        required: true
    },
    sizeOrUnit: {
        type: Number, // Changed to number as it represents area in sq ft
        required: true
    },
    parkingOption: {
        type: String,
        required: true
    },
    timeToContact: {
        type: String, // Assuming this represents time as a string
        required: true
    },
    Age: {
        type: Number, // Changed to number as it represents age of the property
        required: false // Assuming this field is optional
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
        required: false
    },
    cost: {
        type: Number, // Changed to number as it represents cost
        required: true
    },
    // Assuming you have a User model with the name 'User'
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
