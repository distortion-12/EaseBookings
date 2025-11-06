const mongoose = require('mongoose');

const BreakSchema = new mongoose.Schema({
  startTime: { type: String, required: true }, // "HH:mm" format
  endTime: { type: String, required: true },
});

const ScheduleSchema = new mongoose.Schema({
  isWorking: { type: Boolean, default: false },
  startTime: { type: String, default: '09:00' }, // "HH:mm" format
  endTime: { type: String, default: '17:00' }, // "HH:mm" format
  breaks: [BreakSchema],
});

const StaffSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a staff member name'],
    trim: true,
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
  },
  // Services this staff member can perform
  assignedServices: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Service',
    },
  ],
  // Weekly schedule for this staff member
  schedule: {
    monday: { type: ScheduleSchema, default: () => ({ isWorking: true }) },
    tuesday: { type: ScheduleSchema, default: () => ({ isWorking: true }) },
    wednesday: { type: ScheduleSchema, default: () => ({ isWorking: true }) },
    thursday: { type: ScheduleSchema, default: () => ({ isWorking: true }) },
    friday: { type: ScheduleSchema, default: () => ({ isWorking: true }) },
    saturday: { type: ScheduleSchema, default: () => ({}) },
    sunday: { type: ScheduleSchema, default: () => ({}) },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Staff', StaffSchema);