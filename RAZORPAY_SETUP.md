# Razorpay Payment Integration Setup Guide

## 1. Get Your Razorpay API Keys

### Step 1: Create a Razorpay Account
1. Go to https://razorpay.com
2. Click **Sign Up** (top right)
3. Enter your email, phone, and password
4. Verify your email and phone
5. Complete business details (business name, address, etc.)
6. Your account will be created

### Step 2: Retrieve API Keys
1. Log in to https://dashboard.razorpay.com
2. Go to **Settings** → **API Keys** (left sidebar)
3. You'll see two tabs: **Live** and **Test**
4. For development, use the **Test** keys
5. Copy both:
   - **Key ID** (public key)
   - **Key Secret** (private key)

### Step 3: Get Your Webhook Secret
1. In the dashboard, go to **Settings** → **Webhooks**
2. Add a new webhook:
   - **Webhook URL**: `http://localhost:8000/api/booking/payments/razorpay-webhook` (for local dev)
   - **Events**: Select:
     - `payment.authorized`
     - `payment.failed`
     - `payment.captured`
3. Copy the **Webhook Secret** shown

## 2. Configure Environment Variables

### Server (.env)
```bash
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_XXXX...       # Your Test Key ID
RAZORPAY_KEY_SECRET=abc123def456...    # Your Test Key Secret
RAZORPAY_WEBHOOK_SECRET=webhook_secret_here

# Booking Configuration
PAYMENT_DEPOSIT_PERCENT=30              # Default deposit % (can be 0-100)
```

### Deployment to Production

When you're ready to go live:
1. In Razorpay dashboard, go to **Settings** → **API Keys**
2. Switch to **Live** tab and copy your live keys
3. Update `.env` to use **live** keys (not test)
4. Update webhook URL in Razorpay dashboard to your live domain:
   - `https://yourdomain.com/api/booking/payments/razorpay-webhook`

## 3. Test the Integration

### Test Cards (In Test Mode Only)

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

### Test UPI
Use any of these test VPAs (in test mode):
- `success@razorpay` (will succeed)
- `failed@razorpay` (will fail)

## 4. Payment Flow

### User Journey
1. User selects service & time in booking modal
2. Clicks **Confirm Booking**
3. Redirects to `/checkout` page
4. Selects deposit percentage (30%, 50%, 100%)
5. Selects payment method (Card or UPI)
6. Clicks **Pay** button
7. Razorpay modal opens
8. User completes payment
9. Webhook confirms payment status
10. Booking is **Confirmed** and user is redirected home

### Statuses
- **PendingPayment**: Slot reserved, awaiting payment (10 min timeout)
- **PaymentFailed**: Payment failed, user can retry
- **Confirmed**: Payment received, booking locked
- **Cancelled**: Admin or user cancels
- **Completed**: Service completed

## 5. Webhook Signature Verification

The webhook endpoint verifies Razorpay's signature using HMAC-SHA256:
```
signature = HMAC-SHA256(raw_body, webhook_secret)
```

This ensures the webhook is genuinely from Razorpay.

## 6. Frontend Razorpay Integration

The checkout page loads Razorpay's script and opens the payment modal:
```javascript
const options = {
  key: razorpayKeyId,          // Your public key
  amount: amountInPaise,        // In paise (1 rupee = 100 paise)
  currency: 'INR',
  order_id: orderId,            // From server order creation
  method: {
    card: true/false,           // Based on user selection
    upi: true/false,
  },
  handler: (response) => {
    // Success callback
  },
};
```

## 7. Troubleshooting

| Issue | Solution |
|-------|----------|
| Webhook not firing | Check webhook URL is publicly accessible; ensure `RAZORPAY_WEBHOOK_SECRET` matches Razorpay dashboard |
| Payment modal doesn't open | Ensure Razorpay script is loaded: `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>` |
| "Invalid webhook signature" | Verify `RAZORPAY_WEBHOOK_SECRET` is correct; webhook body must be raw (not parsed) |
| Test keys not working | Ensure you're using keys from the **Test** tab in Razorpay dashboard |

## 8. Going Live

1. Pass KYC verification in Razorpay
2. Switch to Live keys in Razorpay dashboard
3. Update server `.env` with live keys
4. Update webhook URL to production domain
5. Test with real transactions (small amounts)
6. Monitor payment failures in Razorpay dashboard

## 9. Documentation Links

- [Razorpay Orders API](https://razorpay.com/docs/api/orders/)
- [Razorpay Webhooks](https://razorpay.com/docs/webhooks/)
- [Razorpay Checkout](https://razorpay.com/docs/checkout/web/)
- [Razorpay NPM SDK](https://www.npmjs.com/package/razorpay)
