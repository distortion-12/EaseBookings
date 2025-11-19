/*
 * This file defines the Mongoose schema for Businesses (Providers).
 * It stores account information, business details, and configuration settings.
 */

const mongoose = require('mongoose');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const { DEFAULT_BUSINESS_CONFIG } = require('../config/defaults');

// This schema represents the structure of a business account in the database.
const BusinessSchema = new mongoose.Schema({
  // The name of the business owner.
  ownerName: {
    type: String,
    required: [true, 'Please add an owner name'],
  },
  // The public name of the business.
  businessName: {
    type: String,
    required: [true, 'Please add a business name'],
    unique: true,
    trim: true,
  },
  // The contact email for the business account.
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  // The hashed password for authentication.
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  // A URL-friendly version of the business name for their booking page.
  bookingPageSlug: {
    type: String,
    unique: true,
  },
  // Additional business contact/info fields.
  phone: {
    type: String,
  },
  website: {
    type: String,
  },
  businessType: {
    type: String,
  },
  description: {
    type: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Stores business-specific settings like timezone and slot duration.
  config: {
    timezone: {
      type: String,
      default: DEFAULT_BUSINESS_CONFIG.timezone,
    },
    slotInterval: {
      type: Number,
      default: DEFAULT_BUSINESS_CONFIG.slotInterval,
    },
  },
  // Indicates if the business email has been verified.
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    select: false,
  },
  otpExpires: {
    type: Date,
    select: false,
  },
});

// This function automatically generates a URL-friendly slug from the business name before saving the document.
BusinessSchema.pre('save', function (next) {
  this.bookingPageSlug = slugify(this.businessName, { lower: true });
  next();
});

// This method compares a plain-text password with the hashed password stored in the database during login.
BusinessSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Business', BusinessSchema);