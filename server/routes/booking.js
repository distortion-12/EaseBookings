/*
 * This file defines the API routes for the booking process.
 * It handles checking availability, creating new appointments, and retrieving appointment lists for admins.
 */

const express = require('express');
const router = express.Router();
const {
  getAvailability,
  createAppointment,
  getBusinessAppointments,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// Route to fetch available time slots for a specific service, staff member, and date.
router.get('/:businessSlug/availability', getAvailability);

// Route to create a new appointment booking for a client.
router.post('/:businessSlug/create', createAppointment);

// Route for business admins to retrieve their schedule of appointments. Requires authentication.
router.get('/admin/my-appointments', protect, getBusinessAppointments);

module.exports = router;