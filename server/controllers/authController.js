const Business = require('../models/Business');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // We need this here now

// --- Helper Function to Sign JWT ---
const getSignedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// --- Register Business ---
exports.register = async (req, res) => {
  try {
    const { ownerName, businessName, email, password, address, city, phone, category, hours } = req.body;

    // --- NEW HASHING LOGIC ---
    // 1. Generate salt
    const salt = await bcrypt.genSalt(10);
    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);
    // --- END NEW LOGIC ---

    // 3. Generate a unique slug from business name
    const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '') + Date.now().toString().slice(-4);

    // 4. Create the business owner with all details
    const business = await Business.create({
      ownerName,
      businessName,
      email,
      password: hashedPassword,
      address,
      city,
      phone,
      category,
      hours: hours || '9:00 AM - 6:00 PM',
      config: {
        bookingPageSlug: slug,
      }
    });

    // 5. Create a token
    const token = getSignedToken(business._id);

    // 6. Send response
    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// --- Login Business (no change needed) ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    const business = await Business.findOne({ email }).select('+password');

    if (!business) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, business.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = getSignedToken(business._id);
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- Get Current Logged-in User (no change needed) ---
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.business,
  });
};