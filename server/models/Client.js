const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
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
  phone: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// --- NEW HASHING LOGIC (CALLBACK-BASED) ---
ClientSchema.pre('save', function (next) {
  // 'this' refers to the client document
  const client = this;

  // If password is not modified, just move on
  if (!client.isModified('password')) {
    return next();
  }

  // Generate salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err); // Pass error to 'save'
    }

    // Hash the password using the salt
    bcrypt.hash(client.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      // Overwrite the plain-text password with the hashed one
      client.password = hash;
      next(); // <-- This is the critical part
    });
  });
});
// --- END OF NEW LOGIC ---

module.exports = mongoose.model('Client', ClientSchema);