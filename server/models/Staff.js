/*
 * This file defines the Mongoose schema for Staff members.
 * It stores details about employees, their assigned services, and their working schedule.
 */

const mongoose = require('mongoose');

// This schema represents the structure of a staff member document in the database.
const StaffSchema = new mongoose.Schema({
  // The full name of the staff member.
  name: {
    type: String,
    required: [true, 'Please add a staff name'],
    trim: true,
  },
  // Contact email for the staff member.
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  // Contact phone number.
  phone: String,
  // References the Business that employs this staff member.
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business',
    required: true,
  },
  // List of Services this staff member is qualified to perform.
  assignedServices: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Service',
    },
  ],
  // Defines the weekly working hours and availability for this staff member.
  schedule: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Staff', StaffSchema);