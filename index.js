const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is imported

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'listings', // Folder in your Cloudinary account
    allowedFormats: ['jpg', 'png']
  }
});

const upload = multer({ storage: storage });


const { User } = require('./schema');
const { Listing } = require('./schema_list');
const { Rental } = require('./schema_rent');
const { Wishlist } = require('./Schema_wishlist');

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

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, email, password, userType } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving
    const newUser = new User({ username, email, password: hashedPassword, userType });
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
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });

    res.json({
      token,
      user: {
        userId: user._id,
        username: user.username,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Correctly extract token from headers

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
      parkingOption,
      user: userId
    });

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

// Define a route to handle image uploads
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ url: req.file.path });
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

    user.password = await bcrypt.hash(newPassword, 10); // Hash the new password
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
      rental: rentalId
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

//upload image
app.post('/upload-image', upload.array('image'), (req, res) => {
  try {
    // The uploaded files can be accessed via req.files
    const imageUrls = req.files.map(file => file.path);
    res.json({ urls: imageUrls });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ensure server is listening on the correct port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});








