# Quick Start: Razorpay Setup

## 30-Second Walkthrough

### 1️⃣ Get API Keys
Go to **https://dashboard.razorpay.com** → Settings → API Keys → Copy **Test Keys**

### 2️⃣ Create `.env` File
```bash
# server/.env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
PAYMENT_DEPOSIT_PERCENT=30
```

### 3️⃣ Install Razorpay Package
```bash
cd server
npm install
```

### 4️⃣ Start Servers
```bash
# Terminal 1: Server
cd server && npm run dev

# Terminal 2: Client
cd client && npm run dev
```

### 5️⃣ Test Payment
1. Open http://localhost:3000
2. Book a service → Confirm
3. On checkout, select deposit & method
4. Click "Pay" → Use test card: **4111 1111 1111 1111**, CVV: **123**, Expiry: **12/25**
5. ✅ Payment successful → Booking confirmed!

---

## Get Your API Keys in 2 Minutes

### Razorpay Dashboard Steps:
1. Go to https://razorpay.com
2. **Sign Up** → Verify email & phone
3. Login to https://dashboard.razorpay.com
4. Click **Settings** (bottom left) → **API Keys**
5. Make sure you're on the **Test** tab (for development)
6. **Copy** Key ID and Key Secret
7. Go to **Settings** → **Webhooks**
8. Click **+ Add New Webhook**
   - URL: `http://localhost:8000/api/booking/payments/razorpay-webhook`
   - Events: `payment.captured`, `payment.failed`, `payment.authorized`
   - **Copy** the Webhook Secret shown

### Create `.env` File
```bash
# Create file: server/.env
RAZORPAY_KEY_ID=rzp_test_XXXXX
RAZORPAY_KEY_SECRET=your_secret_xxxxx
RAZORPAY_WEBHOOK_SECRET=webhook_secret_xxxxx
PAYMENT_DEPOSIT_PERCENT=30
```

---

## Payment Flow
```
Book Service → Confirm → Checkout → Pay with Razorpay → Confirmed ✅
```

---

## Test Cards
| Type | Card | CVV | Expiry |
|------|------|-----|--------|
| ✅ Success | 4111 1111 1111 1111 | Any 3 | Any future |
| ❌ Failure | 4000 0000 0000 0002 | Any 3 | Any future |

---

## For Local Webhook Testing
Use **ngrok** (optional):
```bash
ngrok http 8000
# Update webhook URL in Razorpay: https://abc123.ngrok.io/api/booking/payments/razorpay-webhook
```

---

That's it! 🎉 Your payment system is ready.
