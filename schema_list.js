const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true
  },
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
  sqft: {
    type: Number,
    required: true
  },
  parkingOption: {
    type: String,
    required: true
  },
  timeToContact: {
    type: String,
    required: true
  },
  Age: {
    type: Number,
    required: false
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
  saleType: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = {Listing};

