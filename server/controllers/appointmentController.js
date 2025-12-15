const Appointment = require('../models/Appointment');
const Business = require('../models/Business');
const Service = require('../models/Service');
const Staff = require('../models/Staff');
const {
  generateTimeSlots,
  isSlotBooked,
  convertLocalToUTC,
} = require('../utils/timeHelper');
const { parse, startOfDay, endOfDay, format } = require('date-fns');
const { zonedTimeToUtc } = require('date-fns-tz');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Razorpay client (lazy initialized via env)
const razorpayClient =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

const normalizeDepositPercent = (value) => {
  const pct = Number(value);
  if (!Number.isFinite(pct)) return 30;
  if (pct < 0) return 0;
  if (pct > 100) return 100;
  return pct;
};

// === PUBLIC ROUTES ===

// @desc    Get available slots for a service/staff/date
exports.getAvailability = async (req, res) => {
  try {
    const { businessSlug } = req.params;
    const { date, serviceId, staffId } = req.query; // date is "yyyy-MM-dd"

    if (!date || !serviceId || !staffId) {
      return res
        .status(400)
        .json({ success: false, error: 'Missing required query parameters' });
    }

    // 1. Find business and service
    const business = await Business.findOne({ bookingPageSlug: businessSlug });
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    // 2. Find staff member and their schedule for the day
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ success: false, error: 'Staff not found' });
    }

    const dayOfWeek = format(
      parse(date, 'yyyy-MM-dd', new Date()),
      'eeee'
    ).toLowerCase(); // e.g., "monday"
    const daySchedule = staff.schedule[dayOfWeek];

    if (!daySchedule.isWorking) {
      return res.status(200).json({ success: true, data: [] }); // Not working this day
    }

    // 3. Get all existing appointments for this staff on this day
    const timeZone = business.config.timezone;
    const startOfTargetDay = zonedTimeToUtc(`${date}T00:00:00`, timeZone);
    const endOfTargetDay = zonedTimeToUtc(`${date}T23:59:59`, timeZone);

    const existingAppointments = await Appointment.find({
      staff: staffId,
      startTime: { $gte: startOfTargetDay, $lte: endOfTargetDay },
      status: { $in: ['Confirmed', 'PendingPayment'] }, // Block slots held for payment
    });

    // 4. Generate all potential slots
    // We can use a 15-minute interval for booking precision
    const slotInterval = 15;
    const allSlots = generateTimeSlots(
      startOfTargetDay,
      daySchedule.startTime,
      daySchedule.endTime,
      slotInterval,
      timeZone
    );

    // 5. Filter for available slots
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

    // Format slots for the frontend (e.g., "HH:mm")
    const formattedSlots = availableSlots.map((slot) => {
      // We must return the full UTC timestamp so the frontend can post it back
      return slot.toISOString();
    });

    res.status(200).json({ success: true, data: formattedSlots });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a new appointment
exports.createAppointment = async (req, res) => {
  const { businessSlug } = req.params;
  const { serviceId, staffId, startTime, client } = req.body;

  // Use a database session and transaction for concurrency control
  const session = await Appointment.startSession();
  session.startTransaction();

  try {
    // 1. Get Business and Service details
    const business = await Business.findOne({ bookingPageSlug: businessSlug }).session(session);
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    const service = await Service.findById(serviceId).session(session);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    // 2. Calculate end time
    const start = parse(startTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Date());
    const end = new Date(start.getTime() + service.duration * 60000); // duration in ms

    // 3. CRITICAL: Concurrency Check
    // Check if any *other* confirmed appointment exists in this slot
    const existing = await Appointment.findOne({
      staff: staffId,
      status: { $in: ['Confirmed', 'PendingPayment'] },
      $or: [
        { startTime: { $lt: end, $gte: start } }, // Starts within the slot
        { endTime: { $gt: start, $lte: end } }, // Ends within the slot
      ],
    }).session(session);

    if (existing) {
      // This slot was *just* booked. Abort.
      await session.abortTransaction();
      session.endSession();
      return res
        .status(409) // 409 Conflict
        .json({ success: false, error: 'This time slot just became unavailable.' });
    }

    // 4. Create the new appointment
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
    });
    
    await appointment.save({ session });

    // 5. Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // 6. TODO: Trigger email notifications here (Phase 2)

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create Razorpay order for a booking and place the slot on hold
exports.createPaymentOrder = async (req, res) => {
  const { businessSlug } = req.params;
  const { serviceId, staffId, startTime, client, depositPercent } = req.body;

  if (!razorpayClient) {
    return res.status(500).json({ success: false, error: 'Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' });
  }

  if (!serviceId || !staffId || !startTime || !client?.name || !client?.email) {
    return res.status(400).json({ success: false, error: 'Missing required fields for payment.' });
  }

  try {
    const business = await Business.findOne({ bookingPageSlug: businessSlug });
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ success: false, error: 'Staff not found' });
    }

    const start = parse(startTime, "yyyy-MM-dd'T'HH:mm:ss.SSSX", new Date());
    if (Number.isNaN(start)) {
      return res.status(400).json({ success: false, error: 'Invalid start time format' });
    }
    const end = new Date(start.getTime() + service.duration * 60000);

    const existing = await Appointment.findOne({
      staff: staffId,
      status: { $in: ['Confirmed', 'PendingPayment'] },
      $or: [
        { startTime: { $lt: end, $gte: start } },
        { endTime: { $gt: start, $lte: end } },
      ],
    });

    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: 'This time slot is no longer available.' });
    }

    const effectiveDepositPercent = normalizeDepositPercent(
      depositPercent ?? process.env.PAYMENT_DEPOSIT_PERCENT ?? 30
    );
    const amountInPaise = Math.max(
      1,
      Math.round(Number(service.price) * (effectiveDepositPercent / 100) * 100)
    );

    const order = await razorpayClient.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `apt_${businessSlug}_${Date.now()}`,
      notes: {
        businessSlug,
        serviceId,
        staffId,
        clientEmail: client.email,
      },
    });

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
      status: 'PendingPayment',
      payment: {
        status: 'Pending',
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        depositPercent: effectiveDepositPercent,
        expectedTotal: service.price,
        requestedAt: new Date(),
      },
      pricingSnapshot: {
        servicePrice: service.price,
        currency: 'INR',
      },
    });

    await appointment.save();

    res.status(200).json({
      success: true,
      data: {
        appointmentId: appointment._id,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        depositPercent: effectiveDepositPercent,
        servicePrice: service.price,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Handle Razorpay webhook to mark payment status
exports.razorpayWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(500).json({ success: false, error: 'Webhook secret not configured.' });
  }

  const signature = req.headers['x-razorpay-signature'];
  const rawBody = Buffer.isBuffer(req.body)
    ? req.body
    : Buffer.from(JSON.stringify(req.body));

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    return res.status(400).json({ success: false, error: 'Invalid webhook signature' });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch (err) {
    return res.status(400).json({ success: false, error: 'Invalid webhook payload' });
  }

  const paymentEntity = payload?.payload?.payment?.entity;
  if (!paymentEntity?.order_id) {
    return res.status(400).json({ success: false, error: 'Webhook missing order reference' });
  }

  try {
    const appointment = await Appointment.findOne({ 'payment.orderId': paymentEntity.order_id });
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found for order' });
    }

    const paymentStatus = paymentEntity.status;

    if (['captured', 'authorized'].includes(paymentStatus)) {
      appointment.status = 'Confirmed';
      appointment.payment.status = 'Paid';
      appointment.payment.paymentId = paymentEntity.id;
      appointment.payment.signature = signature;
      appointment.payment.method = paymentEntity.method;
      appointment.payment.vpa = paymentEntity.vpa || appointment.payment.vpa;
      appointment.payment.card = paymentEntity.card
        ? {
            network: paymentEntity.card.network,
            last4: paymentEntity.card.last4,
            type: paymentEntity.card.type,
          }
        : appointment.payment.card;
      appointment.payment.paidAt = paymentEntity.captured_at
        ? new Date(paymentEntity.captured_at * 1000)
        : new Date();
    } else if (paymentStatus === 'failed') {
      appointment.status = 'PaymentFailed';
      appointment.payment.status = 'Failed';
      appointment.payment.paymentId = paymentEntity.id;
      appointment.payment.notes = paymentEntity.error_description || 'Payment failed';
    }

    await appointment.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// === ADMIN ROUTE ===

// @desc    Get all appointments for the logged-in admin
exports.getBusinessAppointments = async (req, res) => {
  try {
    const { start, end } = req.query; // ISO date strings

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