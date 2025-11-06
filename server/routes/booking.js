const express = require('express');
const router = express.Router();
const {
  getAvailability,
  createAppointment,
  getBusinessAppointments,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// --- Public Client Routes ---

// @route   GET /api/booking/:businessSlug/availability
// @desc    Get available slots for a service/staff/date
// @access  Public
router.get('/:businessSlug/availability', getAvailability);

// @route   POST /api/booking/:businessSlug/create
// @desc    Create a new appointment
// @access  Public
router.post('/:businessSlug/create', createAppointment);

// --- Admin-Only Route ---

// @route   GET /api/booking/admin/my-appointments
// @desc    Get all appointments for the logged-in admin
// @access  Private
router.get('/admin/my-appointments', protect, getBusinessAppointments);

module.exports = router;