const express = require('express');
const router = express.Router();
const {
  getStaff,
  createStaff,
  getStaffById,
  updateStaff,
  deleteStaff
} = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file are protected
router.use(protect);

// @route   GET /api/admin/staff
// @desc    Get all staff for the logged-in business
router.get('/', getStaff);

// @route   POST /api/admin/staff
// @desc    Create a new staff member
router.post('/', createStaff);

// @route   GET /api/admin/staff/:id
// @desc    Get a single staff member by ID
router.get('/:id', getStaffById);

// @route   PUT /api/admin/staff/:id
// @desc    Update a staff member
router.put('/:id', updateStaff);

// @route   DELETE /api/admin/staff/:id
// @desc    Delete a staff member
router.delete('/:id', deleteStaff);

module.exports = router;