/*
 * This file defines the public API routes accessible to anyone (e.g., website visitors).
 * It allows fetching business details, service lists, and general directory information.
 */

const express = require('express');
const router = express.Router();
const { getBusinessBySlug, getBusinessServices, getAllServices, getAllBusinesses } = require('../controllers/publicController');

// Route to fetch all available services across all businesses.
router.get('/services', getAllServices);

// Route to fetch a list of all registered businesses.
router.get('/businesses', getAllBusinesses);

// Route to fetch details of a specific business using its unique slug.
router.get('/business/:slug', getBusinessBySlug);

// Route to fetch all services offered by a specific business.
router.get('/business/:slug/services', getBusinessServices);

module.exports = router;
