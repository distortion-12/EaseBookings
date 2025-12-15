# EaseBookings - Razorpay Payment Integration Complete

This guide explains what was set up and how to use it.

## What's New

### 1. **Server Changes**

#### Models
- **Appointment Model** (`server/models/Appointment.js`):
  - Added `payment` object to track payment status, order ID, payment method, etc.
  - Added `pricingSnapshot` to store service price at booking time
  - Updated `status` enum to include `PendingPayment`, `PaymentFailed`

#### Controllers
- **Appointment Controller** (`server/controllers/appointmentController.js`):
  - `createPaymentOrder()`: Creates a Razorpay order and holds the slot for 10 minutes
  - `razorpayWebhook()`: Webhook handler that listens for Razorpay payment events and updates booking status
  - Availability checks now block `PendingPayment` slots to prevent double-booking

#### Routes
- **Booking Routes** (`server/routes/booking.js`):
  - `POST /api/booking/:businessSlug/payment/order` - Initiate payment

#### Server Setup
- **server.js**: Raw body parser for webhook signature verification before JSON middleware

#### Package Dependencies
- Added `razorpay` npm package for SDK support

### 2. **Client Changes**

#### New Page
- **Checkout Page** (`client/pages/checkout.js`):
  - Displays booking summary
  - Allows user to select deposit percentage (30%, 50%, 100%)
  - Allows user to select payment method (Card or UPI)
  - Integrated Razorpay payment modal
  - Handles payment success/failure and redirects accordingly

#### Updated Components
- **BookingFlowModal** (`client/components/booking/BookingFlowModal.js`):
  - Modified "Confirm Booking" to save booking details and redirect to checkout page
  - Uses session storage to pass booking context

#### Updated API Client
- **api.js** (`client/lib/api.js`):
  - Added `initiateBookingPayment()` function to call backend payment order endpoint

### 3. **Documentation**
- **RAZORPAY_SETUP.md**: Complete setup guide with instructions for getting API keys

---

## Payment Flow Architecture

```
Booking Modal (Step 2: Details)
    ↓ "Confirm Booking"
SessionStorage: Save booking
    ↓ router.push('/checkout')
Checkout Page
    ↓ Select deposit % & method
    ↓ "Pay" button
POST /api/booking/:businessSlug/payment/order
    ↓ Backend creates Razorpay order
    ↓ Creates PendingPayment appointment
Response: {orderId, amount, razorpayKeyId}
    ↓ Frontend opens Razorpay modal
User pays (Card/UPI)
    ↓
Razorpay webhook: POST /api/booking/payments/razorpay-webhook
    ↓ Verify signature & update appointment
    ↓ status = "Confirmed" + payment.status = "Paid"
Frontend success callback
    ↓ Clear sessionStorage
    ↓ Redirect to home
```

---

## Status Flow

| Status | Description | Next Step |
|--------|-------------|-----------|
| **PendingPayment** | Slot reserved, waiting for payment | User pays or timeout (10 min) |
| **Confirmed** | Payment received, booking locked | Service happens |
| **PaymentFailed** | Payment failed | User retries or books different slot |
| **Completed** | Service finished | Archive |
| **Cancelled** | Admin or user cancelled | Archive |

---

## Key Features Implemented

✅ **Razorpay Integration**
- Order creation with dynamic amounts
- HMAC-SHA256 webhook signature verification
- Support for Card & UPI payments

✅ **Slot Management**
- Slots held during PendingPayment (prevent double-booking)
- Auto-release after 10 min if payment fails

✅ **Flexible Deposits**
- 30% (default), 50%, or 100% of service price
- Configurable via `PAYMENT_DEPOSIT_PERCENT` env var

✅ **Async Event Handling**
- Webhook updates appointment status without blocking checkout
- Payment method & card details stored for records

✅ **Dedicated Checkout Page**
- Clean UI for payment confirmation
- Displays booking summary & remaining balance

---

## Next Steps (For You)

1. **Get Razorpay API Keys** (5 minutes)
   - Go to https://razorpay.com → Sign Up
   - Get Test Keys from Dashboard → Settings → API Keys
   - Copy Key ID and Key Secret

2. **Configure Environment Variables** (2 minutes)
   ```bash
   # server/.env
   RAZORPAY_KEY_ID=rzp_test_XXXX...
   RAZORPAY_KEY_SECRET=abc123def456...
   RAZORPAY_WEBHOOK_SECRET=webhook_secret_from_dashboard
   PAYMENT_DEPOSIT_PERCENT=30
   ```

3. **Install Dependencies** (1 minute)
   ```bash
   cd server
   npm install
   ```

4. **Test Payment Flow** (10 minutes)
   - Start server: `npm run dev`
   - Start client: `npm run dev`
   - Book a service → Pay with test card `4111 1111 1111 1111`
   - Verify webhook updates appointment status

5. **Deploy to Production**
   - Switch to Live keys in Razorpay dashboard
   - Update `.env` with live credentials
   - Update webhook URL to production domain
   - Test with small real transactions

---

## Webhook Testing Locally

For local testing, use **ngrok** to expose your local server to the internet:

```bash
# Install ngrok: https://ngrok.com/download
ngrok http 8000
# You'll get a URL like: https://abc123.ngrok.io

# Add this to Razorpay dashboard webhooks:
# https://abc123.ngrok.io/api/booking/payments/razorpay-webhook
```

---

## Test Scenarios

### ✅ Successful Card Payment
- Card: `4111 1111 1111 1111` | CVV: 123 | Expiry: 12/25
- Result: Appointment moves to "Confirmed" status

### ❌ Failed Card Payment
- Card: `4000 0000 0000 0002` | CVV: 123 | Expiry: 12/25
- Result: Appointment moves to "PaymentFailed", slot is released

### ✅ Successful UPI Payment (Test)
- VPA: `success@razorpay`
- Result: Same as successful card payment

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Razorpay modal doesn't open | Check RAZORPAY_KEY_ID is correct and script loaded |
| Webhook not firing | Ensure webhook URL is publicly accessible + secret matches |
| Payment successful but booking not confirmed | Check webhook logs; verify signature calculation |
| Slots still available during PendingPayment | Restart server or check availability query |

---

## Files Modified

- ✅ `server/package.json` - Added razorpay SDK
- ✅ `server/models/Appointment.js` - Added payment & pricing fields
- ✅ `server/controllers/appointmentController.js` - Added payment order & webhook
- ✅ `server/routes/booking.js` - Added payment route
- ✅ `server/server.js` - Added webhook raw body parsing
- ✅ `client/lib/api.js` - Added initiateBookingPayment function
- ✅ `client/components/booking/BookingFlowModal.js` - Redirect to checkout
- ✅ `client/pages/checkout.js` - NEW: Complete checkout page

---

## Questions?

See `RAZORPAY_SETUP.md` for detailed setup instructions or refer to:
- [Razorpay Documentation](https://razorpay.com/docs)
- [Razorpay NPM SDK](https://www.npmjs.com/package/razorpay)
