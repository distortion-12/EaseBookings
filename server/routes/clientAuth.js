const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/clientAuthController');

// @route   POST /api/client-auth/register
// @desc    Register a new client
// @access  Public
router.post('/register', register);

// @route   POST /api/client-auth/login
// @desc    Login a client & get token
// @access  Public
router.post('/login', login);

module.exports = router;