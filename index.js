require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const { User } = require('./schema');
const { Listing } = require('./schema_list');
const { Rental } = require('./schema_rent');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'property_images',
    allowed_formats: ['jpg', 'png']
  }
});

const upload = multer({ storage: storage });

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.query.token || req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = decoded.userId;
    next();
  });
};


// Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, email, password, userType } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = new User({ username, email, password, userType });
    await newUser.save();

    // Generate token for the newly signed up user
    const token = jwt.sign({ userId: newUser._id }, 'secret', { expiresIn: '2h' });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const userType = user.userType;
    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '4h' });

    res.status(200).json({ message: 'Login successful', token, userType });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
      cost
    } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

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
      user: userId
    });

    await newListing.save();

    res.status(201).json({ message: 'Listing created successfully' });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json(error);
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
      buildingType,
      location,
      landmark,
      streetName,
      areaOccupied,
      monthlyRent,
      securityDeposit,
      ageOfProperty,
      parkingOption,
    } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Create a new rental object
    const newRental = new Rental({
      propertyType,
      buildingType,
      location,
      landmark,
      streetName,
      areaOccupied,
      monthlyRent,
      securityDeposit,
      ageOfProperty,
      parkingOption,
      user: userId
    });

    // Save the new rental object to the database
    await newRental.save();

    res.status(201).json({ message: 'Rental property added successfully' });
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

// Search listings endpoint
app.get('/search-listings', async (req, res) => {
  try {
    const { bhk, location, propertyType } = req.query;
    let filter = {};

    if (bhk) {
      filter.buildingType = bhk;
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (propertyType) {
      filter.propertyType = propertyType;
    }

    const listings = await Listing.find(filter);
    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/upload', verifyToken, upload.array('images'), (req, res) => {
  try {
    // Ensure only authenticated users can upload images
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extract uploaded image URLs
    const imageUrls = req.files.map(file => file.path);

    // Respond with success message and image URLs
    res.status(200).json({ message: 'Images uploaded successfully', urls: imageUrls });
  } catch (error) {
    console.error('Error uploading images:', error);
    // Handle upload errors and respond with an appropriate error message
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Ensure server is listening on the correct port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
