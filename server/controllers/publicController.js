/*
 * This file contains the controller functions for public-facing API endpoints.
 * It handles retrieving business details, service listings, and general directory information without authentication.
 */

const Business = require('../models/Business');
const Service = require('../models/Service');

// Retrieves public business information based on its unique slug.
exports.getBusinessBySlug = async (req, res) => {
  try {
    // Find the business by slug and exclude sensitive fields like password and email.
    const business = await Business.findOne({ bookingPageSlug: req.params.slug })
      .select('-password -email');

    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    res.status(200).json({ success: true, data: business });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Retrieves all services offered by a specific business identified by its slug.
exports.getBusinessServices = async (req, res) => {
  try {
    const business = await Business.findOne({ bookingPageSlug: req.params.slug });

    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    const services = await Service.find({ business: business._id });

    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Retrieves a list of all available services across all businesses for the public directory.
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate('business', 'businessName address bookingPageSlug businessType')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Retrieves a list of all registered businesses for the public directory.
exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find()
      .select('-password -email') // Exclude sensitive info
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: businesses.length, data: businesses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
