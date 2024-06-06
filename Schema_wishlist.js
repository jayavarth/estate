const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  listing: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  rental: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  }
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = { Wishlist };
