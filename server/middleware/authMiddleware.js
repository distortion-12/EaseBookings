/*
 * This file contains middleware for protecting business-specific routes.
 * It verifies JWT tokens to ensure that only authenticated business users can access protected resources.
 */

const jwt = require('jsonwebtoken');
const Business = require('../models/Business');

// Middleware to authenticate business users via JWT.
exports.protect = async (req, res, next) => {
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

      // Retrieve the business record associated with the token's user ID, excluding the password.
      req.business = await Business.findById(decoded.id).select('-password');

      if (!req.business) {
        return res.status(401).json({ success: false, error: 'Not authorized, token failed (Business not found)' });
      }

      next();
    } catch (error) {
      // Handle any errors during token verification (e.g., expiration, invalid signature).
      console.error(error);
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};