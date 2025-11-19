/*
 * This file contains the controller functions for managing staff members.
 * It handles creating, retrieving, updating, and deleting staff profiles, including checks for upcoming appointments before deletion.
 */

const Staff = require('../models/Staff');
const Appointment = require('../models/Appointment');

// Retrieves all staff members associated with the currently authenticated business.
exports.getStaff = async (req, res) => {
  try {
    // Fetch staff members where the business ID matches the authenticated user's ID.
    const staff = await Staff.find({ business: req.business.id }).populate('assignedServices', 'name duration');
    res.status(200).json({ success: true, count: staff.length, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Retrieves a specific staff member by their ID, ensuring the user is authorized to view it.
exports.getStaffById = async (req, res) => {
  try {
    const staffMember = await Staff.findById(req.params.id);

    if (!staffMember) {
      return res.status(404).json({ success: false, error: 'Staff member not found' });
    }

    // Verify that the staff member belongs to the authenticated business.
    if (staffMember.business.toString() !== req.business.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: staffMember });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Creates a new staff member profile for the authenticated business.
exports.createStaff = async (req, res) => {
  try {
    // Associate the new staff member with the authenticated business ID.
    req.body.business = req.business.id;

    const staffMember = await Staff.create(req.body);
    res.status(201).json({ success: true, data: staffMember });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Updates an existing staff member's profile, ensuring the user is authorized to make changes.
exports.updateStaff = async (req, res) => {
  try {
    let staffMember = await Staff.findById(req.params.id);

    if (!staffMember) {
      return res.status(404).json({ success: false, error: 'Staff member not found' });
    }

    // Verify that the staff member belongs to the authenticated business.
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

// Deletes a staff member, ensuring no upcoming appointments exist before removal.
exports.deleteStaff = async (req, res) => {
  try {
    const staffMember = await Staff.findById(req.params.id);

    if (!staffMember) {
      return res.status(404).json({ success: false, error: 'Staff member not found' });
    }

    // Verify that the staff member belongs to the authenticated business.
    if (staffMember.business.toString() !== req.business.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    
    // Check for any future appointments assigned to this staff member.
    const upcomingAppointments = await Appointment.findOne({
        staff: req.params.id,
        startTime: { $gt: new Date() }
    });

    if(upcomingAppointments) {
        return res.status(400).json({ success: false, error: 'This staff member has upcoming appointments. Please reschedule or cancel them first.' });
    }

    // Remove the staff member from the database.
    await staffMember.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};