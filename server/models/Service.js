/*
 * This file defines the Mongoose schema for Services.
 * It represents the offerings (like haircuts, massages) that a business provides.
 */

const mongoose = require('mongoose');

// This schema represents the structure of a service document in the database.
const ServiceSchema = new mongoose.Schema({
  // The title of the service.
  name: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters'],
  },
  // A detailed explanation of what the service entails.
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  // References the Business that offers this service.
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business',
    required: true,
  },
  // The length of the service in minutes.
  duration: {
    type: Number,
    required: [true, 'Please add a duration in minutes'],
    min: 5,
  },
  // The cost of the service.
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0,
  },
  // Extra time needed after the service for cleanup or preparation.
  bufferTime: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Service', ServiceSchema);