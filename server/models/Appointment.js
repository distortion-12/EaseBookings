const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business',
    required: true,
  },
  service: {
    type: mongoose.Schema.ObjectId,
    ref: 'Service',
    required: true,
  },
  staff: {
    type: mongoose.Schema.ObjectId,
    ref: 'Staff',
    required: true,
  },
  client: {
    name: { type: String, required: [true, "Please provide the client's name"] },
    email: { type: String, required: [true, "Please provide the client's email"] },
    phone: { type: String },
    // We can add a ref to a 'Client' model later if we build full client accounts
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'NoShow', 'Completed'],
    default: 'Confirmed',
  },
  notes: {
    type: String, // Private notes for the admin
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);