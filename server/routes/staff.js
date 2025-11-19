/*
 * This file defines the API routes for managing staff members.
 * It allows business owners to add, view, update, and remove staff from their team.
 */

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

// Applies authentication middleware to ensure only logged-in business owners can manage staff.
router.use(protect);

// Route to retrieve all staff members associated with the authenticated business.
router.get('/', getStaff);

// Route to add a new staff member to the team.
router.post('/', createStaff);

// Route to fetch details of a specific staff member by their ID.
router.get('/:id', getStaffById);

// Route to update details of an existing staff member.
router.put('/:id', updateStaff);

// Route to remove a staff member from the system.
router.delete('/:id', deleteStaff);

module.exports = router;