/*
 * This file contains middleware for protecting client-specific routes.
 * It verifies JWT tokens to ensure that only authenticated clients can access protected resources.
 */

const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

// Middleware to authenticate client users via JWT.
exports.protectClient = async (req, res, next) => {
  let token;

  // Check for the presence of a Bearer token in the Authorization header.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token string from the header.
      token = req.headers.authorization.split(' ')[1];
      
      // Verify the token's validity and decode its payload.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Retrieve the client record associated with the token's user ID, excluding the password.
      req.client = await Client.findById(decoded.id).select('-password');

      if (!req.client) {
        return res.status(401).json({ success: false, error: 'Not authorized, client not found' });
      }

      next();
    } catch (error) {
      // Handle any errors during token verification.
      console.error(error);
      res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};
