const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  contactInformation: {
    contactInformation: {
      phoneNumber: {
        type: String,
        required: true,
        validate: {
          validator: function(v) {
            // Define your regex pattern for phone number validation
            const phoneRegex = /^\d{10}$/; // Example: 10 digits phone number pattern
            return phoneRegex.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        }
      },
    },
    timeToContact: {
      type: String,
      required: true,
    }
  },
  address: {
    location: {
      type: String,
      required: true,
      max:200// Add maximum length validation if needed
    },
    landmark: {
      type: String,
      required: true,
      max:200// Add maximum length validation if needed
    },
    streetName: {
      type: String,
      required: true,
      max:100// Add maximum length validation if needed
    }
  },
  sqft: {
    type: Number,
    required: true,
    min: 0 // Ensure sqft is a positive number
  },
  parkingOption: {
    type: String,
    required: true,
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
    required: false
  },
  saleType: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true,
    min:0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});


const Listing = mongoose.model('Listing', listingSchema);

module.exports = {Listing};


