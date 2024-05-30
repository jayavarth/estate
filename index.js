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
app.post('/upload-image', upload.array('image', 10), (req, res) => {
  // Multer middleware will process the file uploads and store the images in Cloudinary storage

  // Check if files were uploaded successfully
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  const imageUrls = req.files.map(file => file.secure_url); // Retrieve the secure URLs of the uploaded images from Cloudinary

  res.json({ urls: imageUrls }); // Send the image URLs back to the client
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

    let listings = [];
    if (listingType === 'sale') {
      listings = await Listing.find(saleFilter);
    } else if (listingType === 'rent') {
      listings = await Rental.find(rentalFilter);
    } else {
      const sales = await Listing.find(saleFilter);
      const rentals = await Rental.find(rentalFilter);
      listings = [...sales, ...rentals];
    }

    res.status(200).json(listings);
  } catch (error) {
    console.error('Error searching listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create wishlist endpoint
app.post('/wishlist', verifyToken, async (req, res) => {
  try {
    const { listingId } = req.body;
    const userId = req.userId;

    const newWishlist = new Wishlist({
      listing: listingId,
      user: userId
    });

    await newWishlist.save();

    res.status(201).json({ message: 'Added to wishlist successfully' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve user's wishlist endpoint
app.get('/wishlist', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const wishlist = await Wishlist.find({ user: userId }).populate('listing');
    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
