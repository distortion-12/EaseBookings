const Staff = require('../models/Staff');
const Appointment = require('../models/Appointment');

// @desc    Get all staff for the logged-in business
exports.getStaff = async (req, res) => {
  try {
    // req.business.id comes from the 'protect' middleware
    const staff = await Staff.find({ business: req.business.id }).populate('assignedServices', 'name duration');
    res.status(200).json({ success: true, count: staff.length, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get a single staff member by ID
exports.getStaffById = async (req, res) => {
  try {
    const staffMember = await Staff.findById(req.params.id);

    if (!staffMember) {
      return res.status(404).json({ success: false, error: 'Staff member not found' });
    }

    // Check ownership
    if (staffMember.business.toString() !== req.business.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: staffMember });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a new staff member
exports.createStaff = async (req, res) => {
  try {
    // Add the business ID from the logged-in user to the request body
    req.body.business = req.business.id;

    const staffMember = await Staff.create(req.body);
    res.status(201).json({ success: true, data: staffMember });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update a staff member
exports.updateStaff = async (req, res) => {
  try {
    let staffMember = await Staff.findById(req.params.id);

    if (!staffMember) {
      return res.status(404).json({ success: false, error: 'Staff member not found' });
    }

    // Check ownership
    if (staffMember.business.toString() !== req.business.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    staffMember = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: staffMember });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete a staff member
exports.deleteStaff = async (req, res) => {
  try {
    const staffMember = await Staff.findById(req.params.id);

    if (!staffMember) {
      return res.status(404).json({ success: false, error: 'Staff member not found' });
    }

    // Check ownership
    if (staffMember.business.toString() !== req.business.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    
    // Check for future appointments before deleting
    const upcomingAppointments = await Appointment.findOne({
        staff: req.params.id,
        startTime: { $gt: new Date() }
    });

    if(upcomingAppointments) {
        return res.status(400).json({ success: false, error: 'This staff member has upcoming appointments. Please reschedule or cancel them first.' });
    }

    await staffMember.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};