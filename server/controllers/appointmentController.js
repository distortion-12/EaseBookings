/*
 * This file contains the controller functions for managing appointments.
 * It handles availability checks, booking creation (with concurrency control), and retrieving appointment lists.
 */

const Appointment = require('../models/Appointment');
const Business = require('../models/Business');
const Service = require('../models/Service');
const Staff = require('../models/Staff');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendEmail, getConfirmationHtml } = require('../utils/email');
const {
  generateTimeSlots,
  isSlotBooked,
} = require('../utils/timeHelper');
const { parse, format } = require('date-fns');
const { zonedTimeToUtc } = require('date-fns-tz');

// Calculates and returns available time slots for a specific service, staff member, and date.
exports.getAvailability = async (req, res) => {
  try {
    const { businessSlug } = req.params;
    const { date, serviceId, staffId } = req.query;

    if (!date || !serviceId || !staffId) {
      return res
        .status(400)
        .json({ success: false, error: 'Missing required query parameters' });
    }

    // Retrieve business and service details to validate the request.
    const business = await Business.findOne({ bookingPageSlug: businessSlug });
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    // Retrieve staff details and check their working schedule for the requested day.
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ success: false, error: 'Staff not found' });
    }

    const dayOfWeek = format(
      parse(date, 'yyyy-MM-dd', new Date()),
      'eeee'
    ).toLowerCase();
    const daySchedule = staff.schedule[dayOfWeek];

    if (!daySchedule.isWorking) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Fetch existing confirmed appointments to determine conflicts.
    const timeZone = business.config.timezone;
    const startOfTargetDay = zonedTimeToUtc(`${date}T00:00:00`, timeZone);
    const endOfTargetDay = zonedTimeToUtc(`${date}T23:59:59`, timeZone);

    const existingAppointments = await Appointment.find({
      staff: staffId,
      startTime: { $gte: startOfTargetDay, $lte: endOfTargetDay },
      status: 'Confirmed',
    });

    // Generate all possible time slots based on the staff's working hours.
    const slotInterval = 15;
    const allSlots = generateTimeSlots(
      startOfTargetDay,
      daySchedule.startTime,
      daySchedule.endTime,
      slotInterval,
      timeZone
    );

    // Filter out slots that are already booked or conflict with breaks.
    const availableSlots = allSlots.filter((slot) => {
      return !isSlotBooked(
        slot,
        service.duration,
        service.bufferTime,
        existingAppointments,
        daySchedule.breaks,
        date,
        timeZone
      );
    });

    // Return the available slots as ISO strings.
    const formattedSlots = availableSlots.map((slot) => {
      return slot.toISOString();
    });

    res.status(200).json({ success: true, data: formattedSlots });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Creates a new appointment, ensuring no double-booking occurs via database transactions.
exports.createAppointment = async (req, res) => {
  const { businessSlug } = req.params;
  const { serviceId, staffId, startTime, client, paymentIntentId } = req.body;

  // Start a database transaction to ensure data integrity during the booking process.
  const session = await Appointment.startSession();
  session.startTransaction();

  try {
    // Validate business and service existence within the transaction session.
    const business = await Business.findOne({ bookingPageSlug: businessSlug }).session(session);
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    const service = await Service.findById(serviceId).session(session);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    // Calculate the appointment end time based on service duration.
    const start = parse(startTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Date());
    const end = new Date(start.getTime() + service.duration * 60000);

    // Check for any conflicting appointments that might have been confirmed simultaneously.
    const existing = await Appointment.findOne({
      staff: staffId,
      status: 'Confirmed',
      $or: [
        { startTime: { $lt: end, $gte: start } },
        { endTime: { $gt: start, $lte: end } },
      ],
    }).session(session);

    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(409)
        .json({ success: false, error: 'This time slot just became unavailable.' });
    }

    // Verify the payment status with Stripe if a payment intent ID is provided.
    let paymentStatus = 'Pending';
    if (paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status === 'succeeded') {
        paymentStatus = 'Paid';
      } else {
        throw new Error('Payment not successful');
      }
    }

    // Create and save the new appointment record.
    const appointment = new Appointment({
      business: business._id,
      service: serviceId,
      staff: staffId,
      startTime: start,
      endTime: end,
      client: {
        name: client.name,
        email: client.email,
        phone: client.phone,
      },
      status: 'Confirmed',
      paymentIntentId: paymentIntentId,
      paymentStatus: paymentStatus,
    });
    
    await appointment.save({ session });

    // Commit the transaction to finalize the booking.
    await session.commitTransaction();
    session.endSession();

    // Send a confirmation email to the client.
    try {
        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('service')
            .populate('staff');
        
        const emailHtml = getConfirmationHtml(populatedAppointment, business);
        await sendEmail(
            client.email, 
            `Booking Confirmed: ${service.name} at ${business.businessName}`, 
            emailHtml
        );
    } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
    }

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, error: error.message });
  }
};

// Retrieves a list of appointments for the logged-in business admin, filtered by date range.
exports.getBusinessAppointments = async (req, res) => {
  try {
    const { start, end } = req.query;

    const appointments = await Appointment.find({
      business: req.business.id,
      startTime: { $gte: new Date(start) },
      endTime: { $lte: new Date(end) },
    })
      .populate('service', 'name duration price')
      .populate('staff', 'name')
      .sort({ startTime: 'asc' });

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};