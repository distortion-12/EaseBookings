const express = require('express');
const router = express.Router();
const {
  getAvailability,
  createAppointment,
  getBusinessAppointments,
  createPaymentOrder,
} = require('../controllers/appointmentController');
const { protect, clientProtect } = require('../middleware/authMiddleware');

// --- Public Client Routes ---

// @route   GET /api/booking/:businessSlug/availability
// @desc    Get available slots for a service/staff/date
// @access  Public
router.get('/:businessSlug/availability', getAvailability);

// @route   POST /api/booking/:businessSlug/create
// @desc    Create a new appointment
// @access  Client Private
router.post('/:businessSlug/create', clientProtect, createAppointment);

// @route   POST /api/booking/:businessSlug/payment/order
// @desc    Create Razorpay order and hold the slot
// @access  Client Private
router.post('/:businessSlug/payment/order', clientProtect, createPaymentOrder);

// --- Admin-Only Route ---

// @route   GET /api/booking/admin/my-appointments
// @desc    Get all appointments for the logged-in admin
// @access  Private
router.get('/admin/my-appointments', protect, getBusinessAppointments);

module.exports = router;