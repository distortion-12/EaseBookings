const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { razorpayWebhook } = require('./controllers/appointmentController');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --- START CORS FIX ---
// Explicitly define the allowed origin
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // For legacy browser support
};

// Use the explicit CORS options
app.use(cors(corsOptions));
// --- END CORS FIX ---

// Razorpay webhook needs raw body for signature verification
app.post(
  '/api/booking/payments/razorpay-webhook',
  express.raw({ type: 'application/json' }),
  razorpayWebhook
);

// Body parser middleware (to accept JSON)
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('AppointEase API is running...');
});

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin/services', require('./routes/service'));
app.use('/api/admin/staff', require('./routes/staff'));
app.use('/api/booking', require('./routes/booking'));
app.use('/api/client-auth', require('./routes/clientAuth'));
app.use('/api/business', require('./routes/business'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});