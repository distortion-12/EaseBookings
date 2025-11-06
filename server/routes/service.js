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

// All routes in this file are protected and require a valid token
router.use(protect);

// @route   GET /api/admin/services
// @desc    Get all services for the logged-in business
router.get('/', getServices);

// @route   POST /api/admin/services
// @desc    Create a new service
router.post('/', createService);

// @route   GET /api/admin/services/:id
// @desc    Get a single service by ID
router.get('/:id', getServiceById);

// @route   PUT /api/admin/services/:id
// @desc    Update a service
router.put('/:id', updateService);

// @route   DELETE /api/admin/services/:id
// @desc    Delete a service
router.delete('/:id', deleteService);

module.exports = router;