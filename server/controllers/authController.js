/*
 * This file contains the controller functions for business authentication.
 * It handles registration (with OTP verification), login, and retrieving the current user's profile.
 */

const Business = require('../models/Business');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/email');

// Generates a signed JWT token for a given user ID.
const getSignedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Registers a new business, hashes the password, and sends an OTP for email verification.
exports.register = async (req, res) => {
  try {
    const {
      ownerName,
      businessName,
      email,
      password,
      phone,
      website,
      businessType,
      description,
      address,
    } = req.body;

    // Generate a salt and hash the password for security.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a 6-digit OTP and set its expiration time (10 minutes).
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    // Create the business record with the hashed password and OTP details.
    const business = await Business.create({
      ownerName,
      businessName,
      email,
      password: hashedPassword,
      phone,
      website,
      businessType,
      description,
      address,
      otp,
      otpExpires,
      isVerified: false,
    });

    // Construct and send the verification email containing the OTP.
    const message = `
      <h1>Verify Your Account</h1>
      <p>Your OTP for AppointEase registration is: <strong>${otp}</strong></p>
      <p>This code expires in 10 minutes.</p>
    `;
    
    try {
        await sendEmail(email, 'Verify Your Account - AppointEase', message);
    } catch (emailError) {
        console.error("Failed to send OTP email", emailError);
    }

    res.status(201).json({ success: true, email });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Verifies the OTP provided by the user to activate their account.
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Please provide email and OTP' });
    }

    // Retrieve the business record including the hidden OTP fields.
    const business = await Business.findOne({ email }).select('+otp +otpExpires');

    if (!business) {
      return res.status(400).json({ success: false, error: 'Invalid email' });
    }

    if (business.isVerified) {
        return res.status(400).json({ success: false, error: 'Account already verified' });
    }

    if (business.otp !== otp) {
      return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }

    if (business.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, error: 'OTP expired' });
    }

    // Mark the account as verified and clear the OTP data.
    business.isVerified = true;
    business.otp = undefined;
    business.otpExpires = undefined;
    await business.save();

    // Generate and return an authentication token.
    const token = getSignedToken(business._id);

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Authenticates a business user and returns a JWT token if credentials are valid.
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // Retrieve the business record including the password hash.
    const business = await Business.findOne({ email }).select('+password');

    if (!business) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hash.
    const isMatch = await bcrypt.compare(password, business.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (!business.isVerified) {
        return res.status(401).json({ success: false, error: 'Please verify your email first.' });
    }

    const token = getSignedToken(business._id);
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Returns the profile information of the currently authenticated business.
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.business,
  });
};