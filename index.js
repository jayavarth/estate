const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { User } = require('./schema');
const { Listing } = require('./schema_list');
const { Rental } = require('./schema_rent');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
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

// Signup endpoint
// Signup endpoint
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

    res.status(201).json({ message: 'User created successfully', token, userType: newUser.userType }); // Include userType in response
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


// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.query.token || req.headers.authorization.split(' ')[1];
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
      PhoneNumber,
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
      PhoneNumber,
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
    const savedRental = await newRental.save();

    res.status(201).json({ 
      message: 'Rental property added successfully',
      rentalId: savedRental._id // Include the rental ID in the response
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



// Search listings endpoint
app.get('/search-listings', async (req, res) => {
  try {
    const { bhk, location, propertyType, listingType } = req.query;
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

    if (listingType === "sale" || listingType === "rental") {
      filter.saleType = listingType; // Filter for sale or rental listings
    }

    const listings = await Listing.find(filter);

    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/forgot', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = newPassword;  // Update the user's password
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Example Express.js endpoint to get user details by username
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



// Delete rental endpoint
app.delete('/remove_rentals/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  console.log("Received request to delete rental with ID:", id); // Log rental ID
  try {
      const deletedRental = await Rental.findByIdAndDelete(id);
      if (!deletedRental) {
          console.log("Rental not found for ID:", id); // Log if rental not found
          return res.status(404).json({ error: 'Rental not found' });
      }
      res.sendStatus(204); // No content - successfully deleted
  } catch (error) {
      console.error('Error deleting rental:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});





// Ensure server is listening on the correct port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});