const express = require('express');
const mongoose = require('mongoose');
const { User } = require('./schema');
const { Listing } = require('./schema_list');
const cors = require('cors');
const jwt = require('jsonwebtoken');

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

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
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

// Create listing
app.post('/listings', verifyToken, async (req, res) => {
  try {
    const { ownerType, fullName, phoneNumber, location, images } = req.body;
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

// Fetch user's listings
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
