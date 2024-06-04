const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config(); // Load environment variables

const { User } = require('./schema');
const { Listing } = require('./schema_list');
const { Rental } = require('./schema_rent');
const { Wishlist } = require('./Schema_wishlist');

const app = express();
const port = process.env.PORT || 3000;

const Activity = mongoose.model('Activity', new mongoose.Schema({
  username: String,
  description: String,
  date: Date,
}));

const Stats = mongoose.model('Stats', new mongoose.Schema({
  username: String,
  totalProperties: Number,
  propertiesSoldOrRented: Number,
  activeListings: Number,
}));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'listings',
    allowedFormats: ['jpg', 'png'],
  },
});

const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
}));

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

// Signup endpoint
app.post('/signup', validateEmail, async (req, res) => {
  const { username, email, password, userType } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, userType });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, 'secret', { expiresIn: '2h' });

    res.status(201).json({ message: 'User created successfully', token, userType: newUser.userType });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', validateEmail, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });

    res.json({
      token,
      user: {
        userId: user._id,
        username: user.username,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Create listing endpoint
app.post('/listings', verifyToken, async (req, res) => {
  try {
    const {
      ownerType,
      propertyType,
      buildingType,
      saleType,
      timeToContact,
      Age,
      phoneNumber,
      location,
      landmark,
      streetName,
      sqft,
      parkingOption,
      images,
      cost,
    } = req.body;
    const userId = req.userId;

    console.log("Received listing details:", req.body);

    const newListing = new Listing({
      ownerType,
      propertyType,
      buildingType,
      saleType,
      timeToContact,
      Age,
      phoneNumber,
      location,
      landmark,
      streetName,
      sqft,
      parkingOption,
      images,
      cost,
      user: userId,
    });

    await newListing.save();

    res.status(201).json({ message: 'Listing created successfully' });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve user's listings endpoint
app.get('/added-listings', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const listings = await Listing.find({ user: userId });
    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve all listings endpoint
app.get('/all-listings', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create rental endpoint
app.post('/rentals', verifyToken, async (req, res) => {
  try {
    const {
      propertyType,
      PhoneNumber,
      buildingType,
      location,
      landmark,
      streetName,
      areaOccupied,
      monthlyRent,
      securityDeposit,
      ageOfProperty,
      images,
      parkingOption,
    } = req.body;
    const userId = req.userId;

    const newRental = new Rental({
      propertyType,
      PhoneNumber,
      buildingType,
      location,
      landmark,
      streetName,
      areaOccupied,
      monthlyRent,
      securityDeposit,
      ageOfProperty,
      images,
      parkingOption,
      user: userId,
    });

    const savedRental = await newRental.save();

    res.status(201).json({
      message: 'Rental property added successfully',
      rentalId: savedRental._id,
    });
  } catch (error) {
    console.error('Error adding rental property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve user's rental properties endpoint
app.get('/added-rentals', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const rentals = await Rental.find({ user: userId });
    res.status(200).json(rentals);
  } catch (error) {
    console.error('Error fetching user rentals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve all rental properties endpoint
app.get('/all-rentals', async (req, res) => {
  try {
    const rentals = await Rental.find();
    res.status(200).json(rentals);
  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define a route to handle image uploads
app.post('/upload-image', upload.array('image'), (req, res) => {
  try {
    const imageUrls = req.files.map(file => file.path);
    res.json({ urls: imageUrls });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search listings endpoint
app.get('/search-listings', async (req, res) => {
  try {
    const { bhk, location, propertyType, listingType } = req.query;
    let saleFilter = {};
    let rentalFilter = {};

    if (bhk) {
      saleFilter.buildingType = rentalFilter.buildingType = bhk;
    }
    if (location) {
      saleFilter.location = rentalFilter.location = { $regex: location, $options: 'i' };
    }
    if (propertyType) {
      saleFilter.propertyType = rentalFilter.propertyType = propertyType;
    }

    let saleListings = [];
    let rentalListings = [];

    if (listingType === "sale" || !listingType) {
      saleListings = await Listing.find(saleFilter);
    }
    if (listingType === "rental" || !listingType) {
      rentalListings = await Rental.find(rentalFilter);
    }

    res.status(200).json({ saleListings, rentalListings });
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot password endpoint
app.post('/forgot', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to add items to wishlist
app.post('/add-to-wishlist', verifyToken, async (req, res) => {
  const { listingId, rentalId } = req.body;
  const userId = req.userId;

  try {
    const wishlistItem = new Wishlist({
      user: userId,
      listing: listingId,
      rental: rentalId,
    });

    await wishlistItem.save();

    res.status(201).json({ message: 'Added to wishlist successfully' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to retrieve wishlist
app.get('/wishlist', verifyToken, async (req, res) => {
  const userId = req.query.userId;
  try {
    const wishlistItems = await Wishlist.find({ userId: userId });
    res.json(wishlistItems);
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get user details by username
app.get('/api/profile/:username', verifyToken, async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get recent activity by username
app.get('/api/recent-activity/:username', verifyToken, async (req, res) => {
  const username = req.params.username;
  try {
    const activities = await Activity.find({ username });
    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get user stats by username
app.get('/api/stats/:username', verifyToken, async (req, res) => {
  const username = req.params.username;
  try {
    const stats = await Stats.findOne({ username });
    if (!stats) {
      return res.status(404).json({ error: 'Stats not found' });
    }
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete rental endpoint
app.delete('/remove_listing/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received request to delete listing with ID:", id);

    // Check if the ID is valid
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid listing ID' });
    }

    // Find and remove the listing
    const removedListing = await Listing.findByIdAndDelete(id);

    // Check if the listing was found and removed
    if (removedListing) {
      res.json({ message: 'Listing removed successfully' });
    } else {
      res.status(404).json({ error: 'Listing not found' });
    }
  } catch (error) {
    console.error("Error removing listing:", error);
    res.status(500).json({ error: 'Failed to remove listing' });
  }
});

// Example endpoint to add activity (for testing purposes)
app.post('/api/add-activity', verifyToken, async (req, res) => {
  try {
    const activity = new Activity({
      username: req.body.username,
      description: req.body.description,
      date: new Date(),
    });
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example endpoint to add stats (for testing purposes)
app.post('/api/add-stats', verifyToken, async (req, res) => {
  try {
    const stats = new Stats({
      username: req.body.username,
      totalProperties: req.body.totalProperties,
      propertiesSoldOrRented: req.body.propertiesSoldOrRented,
      activeListings: req.body.activeListings,
    });
    await stats.save();
    res.status(201).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
