const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Please add a service duration in minutes'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  bufferTime: {
    type: Number, // In minutes
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Service', ServiceSchema);