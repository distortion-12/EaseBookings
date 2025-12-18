# EaseBookings - Appointment & Service Booking Platform

A full-stack appointment booking platform with integrated **Razorpay** payment gateway supporting UPI and card payments. Built with **Next.js**, **Express.js**, and **MongoDB**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-v18%2B-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0%2B-green)

---

## 🎯 Features

### Client Features
- ✅ Browse services by category (Salons, Clinics, Consultants, Tutors)
- ✅ Multi-step booking flow (select service → pick time & staff → confirm details → pay)
- ✅ Real-time availability checking with timezone support
- ✅ Client authentication & profile management
- ✅ Dedicated checkout page with payment options
- ✅ Session-based booking context

### Payment Features
- 💳 **Razorpay Integration** - UPI & Card payments
- 💰 **Flexible Deposits** - Pay 30%, 50%, or 100% upfront
- 🔒 **Secure Webhooks** - HMAC-SHA256 signature verification
- ⚡ **Async Processing** - Webhook updates booking status in real-time
- 📱 **Mobile Optimized** - Fully responsive checkout page

### Admin Features
- 📅 Service management (create, update, delete)
- 👥 Staff management with schedules
- 📊 Dashboard & calendar view
- 📋 Appointment tracking & history
- 🔐 Role-based access control

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 13+, React, Tailwind CSS, date-fns |
| **Backend** | Express.js, Node.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT (JSON Web Tokens) |
| **Payments** | Razorpay |
| **Utilities** | date-fns-tz (timezone), bcryptjs (hashing) |

---

## 📦 Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- **MongoDB** (local or Atlas cloud)
- **Razorpay Account** (free test account available)

---

## 🚀 Quick Start (5 minutes)

### 1️⃣ Clone & Install
```bash
git clone https://github.com/distortion-12/EaseBookings.git
cd EaseBookings

# Install dependencies
cd server && npm install
cd client && npm install
```

### 2️⃣ Configure Environment Variables

**Server** (`server/.env`):
```bash
# Database
MONGO_URI=mongodb://localhost:27017/easebookings
# or MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/easebookings

# JWT
JWT_SECRET=your_super_secret_key_change_this

# Razorpay (Get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_XXXX...
RAZORPAY_KEY_SECRET=your_secret_key...
RAZORPAY_WEBHOOK_SECRET=webhook_secret_from_dashboard

# Payment Config
PAYMENT_DEPOSIT_PERCENT=30

# Port
PORT=8000
```

**Client** (`client/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3️⃣ Get Razorpay API Keys (2 minutes)

1. Go to https://razorpay.com → **Sign Up** (free)
2. Complete verification (email + phone)
3. Login to https://dashboard.razorpay.com
4. Click **Settings** → **API Keys** → **Test** tab
5. Copy **Key ID** and **Key Secret** → Add to `.env`
6. Go to **Settings** → **Webhooks** → **Add Webhook**
   - URL: `http://localhost:8000/api/booking/payments/razorpay-webhook`
   - Events: `payment.captured`, `payment.failed`, `payment.authorized`
   - Copy **Webhook Secret** → Add to `.env`

See [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md) for detailed setup.

### 4️⃣ Run Development Servers

**Terminal 1 - Server:**
```bash
cd server
npm run dev
# Server runs on http://localhost:8000
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
# Client runs on http://localhost:3000
```

### 5️⃣ Test the Payment Flow

1. Open http://localhost:3000
2. **Register/Login** as a client
3. **Book a service** → Select time & staff → Confirm details
4. **Checkout** → Select deposit % → Choose payment method
5. **Test Payment:**
   - Card: `4111 1111 1111 1111` | CVV: `123` | Expiry: `12/25`
   - UPI: `success@razorpay` (test mode)
6. ✅ Payment succeeds → Booking confirmed!

---

## 📂 Project Structure

```
EaseBookings/
├── client/                          # Next.js Frontend
│   ├── components/
│   │   ├── admin/                  # Admin dashboard components
│   │   ├── booking/                # Booking flow & checkout
│   │   ├── common/                 # Shared components (Modal, etc)
│   │   ├── home/                   # Homepage components
│   │   └── layout/                 # Layout & navigation
│   ├── context/                    # Auth context & state management
│   ├── lib/                        # API client (axios)
│   ├── pages/
│   │   ├── checkout.js            # NEW: Payment checkout page
│   │   ├── admin/                 # Admin dashboard pages
│   │   ├── category/              # Category pages
│   │   └── [businessSlug]/        # Business booking pages
│   └── styles/                     # Global CSS & Tailwind
│
├── server/                          # Express Backend
│   ├── controllers/
│   │   ├── appointmentController.js    # Booking + Payment logic
│   │   ├── authController.js           # Admin auth
│   │   ├── clientAuthController.js     # Client auth
│   │   ├── serviceController.js        # Service CRUD
│   │   └── staffController.js          # Staff CRUD
│   ├── models/                     # Mongoose schemas
│   ├── routes/                     # API endpoints
│   ├── middleware/                 # Auth & error handling
│   ├── utils/                      # Helpers (timezone, email)
│   └── server.js                   # Express app & webhooks
│
├── RAZORPAY_SETUP.md               # Detailed Razorpay setup guide
├── QUICK_START.md                  # 30-second quick start
└── README.md                       # This file
```

---

## 🔄 Payment Flow Architecture

```
User Books Service
    ↓
BookingFlowModal (Step 2)
    ↓ "Confirm Booking"
Save to sessionStorage → Redirect to /checkout
    ↓
CheckoutPage
    ↓ Select deposit % & payment method
    ↓ "Pay" button
POST /api/booking/:slug/payment/order
    ↓ Backend creates Razorpay order
    ↓ Creates Appointment with status=PendingPayment
Response: {orderId, amount, razorpayKeyId}
    ↓
Frontend opens Razorpay modal
    ↓
User completes payment (Card/UPI)
    ↓
Razorpay webhook: POST /api/booking/payments/razorpay-webhook
    ↓ Verify signature & update appointment
    ↓ status = "Confirmed" + payment.status = "Paid"
Frontend success callback
    ↓ Clear sessionStorage & redirect home
```

---

## 🗄️ Database Schema

### Appointment
```javascript
{
  business: ObjectId,
  service: ObjectId,
  staff: ObjectId,
  client: { name, email, phone },
  startTime: Date,
  endTime: Date,
  status: "PendingPayment|Confirmed|PaymentFailed|Cancelled|Completed",
  payment: {
    status: "Pending|Paid|Failed|Refunded",
    orderId: String,          // Razorpay order ID
    paymentId: String,        // Razorpay payment ID
    method: String,           // "card" or "upi"
    vpa: String,              // UPI ID if UPI payment
    card: { network, last4, type },
    amount: Number,           // In paise
    depositPercent: Number,
    expectedTotal: Number,
    paidAt: Date
  },
  pricingSnapshot: { servicePrice, currency }
}
```

---

## 📚 API Endpoints

### Booking & Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/booking/:slug/availability` | Public | Get available time slots |
| POST | `/api/booking/:slug/payment/order` | Client | Create Razorpay order |
| POST | `/api/booking/payments/razorpay-webhook` | Webhook | Handle payment events |
| GET | `/api/booking/admin/my-appointments` | Admin | Get all appointments |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/client-auth/register` | Client signup |
| POST | `/api/client-auth/login` | Client login |
| POST | `/api/auth/register` | Admin signup |
| POST | `/api/auth/login` | Admin login |

### Admin Resources
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/admin/services` | Admin | Create service |
| GET | `/api/admin/services` | Admin | List services |
| PUT | `/api/admin/services/:id` | Admin | Update service |
| DELETE | `/api/admin/services/:id` | Admin | Delete service |
| POST | `/api/admin/staff` | Admin | Create staff |
| GET | `/api/admin/staff` | Admin | List staff |

---

## 🧪 Testing

### Test Cards (Test Mode Only)
| Type | Card | CVV | Expiry |
|------|------|-----|--------|
| ✅ Success | 4111 1111 1111 1111 | Any 3 | Any future |
| ❌ Failure | 4000 0000 0000 0002 | Any 3 | Any future |

### Test UPI (Test Mode)
- **Success:** `success@razorpay`
- **Failure:** `failed@razorpay`

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel via GitHub
```

### Backend (Heroku/Railway/Render)
```bash
cd server
npm run build  # If you have a build script
# Deploy via Git or CLI
```

### Razorpay Live Mode
1. Pass KYC verification in Razorpay dashboard
2. Switch to **Live** keys
3. Update `.env` with live credentials:
   ```bash
   RAZORPAY_KEY_ID=rzp_live_XXXX...
   RAZORPAY_KEY_SECRET=live_secret...
   ```
4. Update webhook URL to production domain
5. Test with small real transactions

See [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md#going-live) for full guide.

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **401 Client not authorized** | Clear cache & ensure client token is in axios headers (fixed in AuthContext) |
| **Razorpay modal doesn't open** | Check `RAZORPAY_KEY_ID` is correct; verify script loaded |
| **Webhook not firing** | Ensure webhook URL is public; verify `RAZORPAY_WEBHOOK_SECRET` matches |
| **Payment successful but booking not confirmed** | Check webhook logs; verify signature calculation |
| **Slots still showing during PendingPayment** | Availability query checks `PendingPayment` status |
| **MongoDB connection fails** | Verify `MONGO_URI` & network access (if Atlas) |

---

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 30-second setup guide
- **[RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md)** - Complete Razorpay integration
- **[PAYMENT_INTEGRATION.md](./PAYMENT_INTEGRATION.md)** - Architecture & features

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 💬 Questions?

- Check [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md) for payment-related questions
- Review [PAYMENT_INTEGRATION.md](./PAYMENT_INTEGRATION.md) for architecture details
- Visit [Razorpay Docs](https://razorpay.com/docs) for payment integration questions

---

**Built with ❤️ for seamless appointment booking**


## Build and run production

Client:
```powershell
cd client
npm run build
npm run start
```

Server:
```powershell
cd server
npm start
```

## Troubleshooting
- You may see npm audit warnings; run `npm audit fix`. Use `--force` cautiously.
- Ensure MongoDB is running and `MONGO_URI` is correct.


