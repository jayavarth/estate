const express = require('express');
const mongoose = require('mongoose');
const { User } = require('./schema'); 
const { Listing } = require('./schema_list'); 
const cors = require('cors'); 

const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://jayavardhinim14:Jayvardh2004@cluster0.yxnqgbb.mongodb.net/estate_db?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.use(express.json());
app.use(cors());

// Authentication middleware
const requireLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = user._id; // Store the user ID in the request object
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// User Signup
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// User Login
app.post('/login', requireLogin, (req, res) => {
  res.status(200).json({ message: 'Login successful' });
});

// Create Listing
app.post('/listings', requireLogin, async (req, res) => {
  try {
    const { ownerType, fullName, phoneNumber, location, images } = req.body;

    // Get the user ID from the request object
    const userId = req.userId;

    const newListing = new Listing({
      ownerType,
      fullName,
      phoneNumber,
      location,
      images,
      user: userId 
    });

    await newListing.save();

    res.status(201).json({ message: 'Listing created successfully' });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Fetch Added Listings
app.get('/added-listings', requireLogin, async (req, res) => {
  try {
    // Get the user ID from the request object
    const userId = req.userId;

    // Fetch only the listings associated with the authenticated user's ID
    const listings = await Listing.find({ user: userId });

    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
