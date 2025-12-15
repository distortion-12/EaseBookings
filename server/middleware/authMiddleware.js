const jwt = require('jsonwebtoken');
const Business = require('../models/Business');
const Client = require('../models/Client');

exports.protect = async (req, res, next) => {
  let token;

  // Check for token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the business by ID from the token payload
    req.business = await Business.findById(decoded.id);

    if (!req.business) {
        return res.status(401).json({ success: false, error: 'No user found with this token' });
    }

    next(); // Proceed to the next middleware or controller
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};

// Client JWT guard
exports.clientProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, error: 'Client not authorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.client = await Client.findById(decoded.id);
    if (!req.client) {
      return res.status(401).json({ success: false, error: 'Invalid client token' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Client not authorized' });
  }
};