/*
 * This file defines the Mongoose schema for Appointments.
 * It stores details about bookings, including the business, service, staff, client, and payment status.
 */

const mongoose = require('mongoose');

// This schema represents the structure of an appointment document in the database.
const AppointmentSchema = new mongoose.Schema({
  // References the Business where the appointment is booked.
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business',
    required: true,
  },
  // References the specific Service being booked.
  service: {
    type: mongoose.Schema.ObjectId,
    ref: 'Service',
    required: true,
  },
  // References the Staff member assigned to this appointment.
  staff: {
    type: mongoose.Schema.ObjectId,
    ref: 'Staff',
    required: true,
  },
  // Stores the contact details of the client making the booking.
  client: {
    type: {
      name: String,
      email: String,
      phone: String,
    },
    required: true,
  },
  // Optionally links to a registered Client account.
  clientUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: false,
  },
  // Defines the start time of the appointment.
  startTime: {
    type: Date,
    required: true,
  },
  // Defines the end time of the appointment.
  endTime: {
    type: Date,
    required: true,
  },
  // Tracks the current state of the appointment (e.g., Confirmed, Cancelled).
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Confirmed',
  },
  // Tracks the payment status associated with this booking.
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  // Stores the Stripe Payment Intent ID for reference.
  paymentIntentId: {
    type: String,
  },
  // Records when the appointment was created.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);