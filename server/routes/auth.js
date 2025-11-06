const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register a new business owner
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login a business owner & get token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get the logged-in business owner's data
// @access  Private (Needs token)
router.get('/me', protect, getMe);

module.exports = router;