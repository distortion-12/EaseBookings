/*
 * This file defines the Mongoose schema for Clients (Customers).
 * It stores user profile information for people booking services.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// This schema represents the structure of a client account in the database.
const ClientSchema = new mongoose.Schema({
  // The full name of the client.
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  // The email address used for login and notifications.
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  // The hashed password for account security.
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  // The contact phone number for booking confirmations.
  phone: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// This function automatically encrypts the password before saving the client record to the database.
ClientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// This method verifies the password provided during login against the stored hash.
ClientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Client', ClientSchema);