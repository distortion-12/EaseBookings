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
    enum: ['PendingPayment', 'Confirmed', 'Cancelled', 'NoShow', 'Completed', 'PaymentFailed'],
    default: 'PendingPayment',
  },
  payment: {
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    orderId: { type: String },
    paymentId: { type: String },
    signature: { type: String },
    method: { type: String },
    vpa: { type: String },
    card: {
      network: { type: String },
      last4: { type: String },
      type: { type: String },
    },
    amount: { type: Number }, // Stored in the smallest currency unit (e.g., paise)
    currency: { type: String, default: 'INR' },
    depositPercent: { type: Number },
    expectedTotal: { type: Number },
    requestedAt: { type: Date },
    paidAt: { type: Date },
    notes: { type: String },
  },
  pricingSnapshot: {
    servicePrice: { type: Number },
    currency: { type: String, default: 'INR' },
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