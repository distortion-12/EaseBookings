const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Service = require('../models/Service');

/*
 * This file defines the API routes for handling payments via Stripe.
 * It creates payment intents to securely process transactions for service bookings.
 */

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Service = require('../models/Service');

// Route to create a Stripe Payment Intent.
// This calculates the amount based on the service price and returns a client secret for the frontend to complete the payment.
router.post('/create-intent', async (req, res) => {
  try {
    const { serviceId } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(service.price * 100), // Amount in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        serviceId: service._id.toString(),
        serviceName: service.name,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
