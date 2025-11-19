/*
 * This file defines the main routing hub for the Admin (Provider) dashboard.
 * It groups together routes for services, staff, appointments, and dashboard summaries, ensuring all are protected.
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const serviceRouter = require('./service');
const staffRouter = require('./staff');
const { getDashboardSummary } = require('../controllers/adminController');
const { getBusinessAppointments } = require('../controllers/appointmentController');

// Applies authentication middleware to all routes defined below, ensuring only logged-in providers can access them.
router.use(protect);

// Route to fetch summary statistics for the admin dashboard (e.g., total bookings, revenue).
router.get('/summary', getDashboardSummary);

// Mounts the service management routes (create, update, delete services) under /services.
router.use('/services', serviceRouter); 

// Mounts the staff management routes (add, remove, update staff) under /staff.
router.use('/staff', staffRouter);

// Route to retrieve appointment data for the business calendar, typically filtered by a date range.
router.get('/appointments', getBusinessAppointments);

module.exports = router;