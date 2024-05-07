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
    // Add a field to store the user's unique identifier
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = {Listing};
