/*
 * This file is the entry point of the backend server.
 * It sets up the Express application, connects to the database, and defines the main API routes.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const clientAuthRoutes = require('./routes/clientAuth');
const adminRoutes = require('./routes/admin');
const bookingRoutes = require('./routes/booking');
const serviceRoutes = require('./routes/service');
const staffRoutes = require('./routes/staff');
const publicRoutes = require('./routes/public');
const paymentRoutes = require('./routes/payment');

const app = express();

app.use(cors());
app.use(express.json());

// This function establishes a connection to the MongoDB database using the connection string from environment variables.
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {});
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
};

connectDB();

// These lines link specific URL paths to their corresponding route handlers (like authentication, booking, etc.).
app.use('/api/auth', authRoutes);
app.use('/api/client-auth', clientAuthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/payment', paymentRoutes);

// This is a simple endpoint to check if the server is running correctly.
app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }));

// If the application is running in production mode, this block serves the frontend files directly.
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'out')));
    app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'client', 'out', 'index.html')));
}

const PORT = process.env.PORT || 8000;

// This command starts the server and makes it listen for incoming requests on the specified port.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));