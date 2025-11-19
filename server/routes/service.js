/*
 * This file defines the API routes for managing services.
 * It allows business owners to create, read, update, and delete the services they offer.
 */

const express = require('express');
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  deleteService,
  getServiceById,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

// Applies authentication middleware to ensure only logged-in business owners can manage services.
router.use(protect);

// Route to retrieve all services belonging to the authenticated business.
router.get('/', getServices);

// Route to create a new service offering.
router.post('/', createService);

// Route to fetch details of a specific service by its ID.
router.get('/:id', getServiceById);

// Route to update an existing service.
router.put('/:id', updateService);

// Route to delete a service.
router.delete('/:id', deleteService);

module.exports = router;