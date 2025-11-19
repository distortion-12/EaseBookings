/*
 * This file defines the API routes for Business (Provider) authentication.
 * It handles registration, login, OTP verification, and fetching the current user.
 */

const express = require('express');
const router = express.Router();
const { register, login, getMe, verifyOtp } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Route to register a new business account.
router.post('/register', register);

// Route to verify the email OTP and activate the account.
router.post('/verify-otp', verifyOtp);

// Route to authenticate a business user and return a JWT token.
router.post('/login', login);

// Route to retrieve the profile of the currently logged-in business user. Requires authentication.
router.get('/me', protect, getMe);

module.exports = router;