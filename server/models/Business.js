const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const BusinessSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: [true, 'Please add an owner name'],
  },
  businessName: {
    type: String,
    required: [true, 'Please add a business name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  address: {
    type: String,
    required: [true, 'Please add a business address'],
  },
  city: {
    type: String,
    required: [true, 'Please add a city'],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  category: {
    type: String,
    required: [true, 'Please add a business category'],
    enum: ['salons', 'clinics', 'consultants', 'tutors'],
  },
  hours: {
    type: String,
    default: '9:00 AM - 6:00 PM',
  },
  config: {
    timezone: {
      type: String,
      default: 'UTC',
    },
    bookingPageSlug: {
      type: String,
      unique: true,
      sparse: true,
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// --- NEW HASHING LOGIC (CALLBACK-BASED) ---
BusinessSchema.pre('save', function (next) {
  // 'this' refers to the business document
  const business = this;

  // If password is not modified, just move on
  if (!business.isModified('password')) {
    return next();
  }

  // Generate salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err); // Pass error to 'save'
    }

    // Hash the password using the salt
    bcrypt.hash(business.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      // Overwrite the plain-text password with the hashed one
      business.password = hash;
      next(); // <-- This is the critical part
    });
  });
});
// --- END OF NEW LOGIC ---

module.exports = mongoose.model('Business', BusinessSchema);