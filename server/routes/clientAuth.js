/*
 * This file defines the API routes for Client (Customer) authentication.
 * It handles registration and login for users who are booking services.
 */

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/clientAuthController');

// Route to register a new client account.
router.post('/register', register);

// Route to authenticate a client and return a JWT token.
router.post('/login', login);

module.exports = router;