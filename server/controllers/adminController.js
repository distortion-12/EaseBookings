/*
 * This file contains the controller functions for the Admin Dashboard.
 * It handles data aggregation for dashboard summaries, such as appointment counts and revenue.
 */

const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const { startOfDay, endOfDay } = require('date-fns');

// Retrieves summary statistics (today's bookings, pending requests, revenue) for the provider's dashboard home page.
exports.getDashboardSummary = async (req, res) => {
    try {
        const businessId = req.business.id;
        const now = new Date();
        
        // Count confirmed appointments scheduled for today.
        const todayConfirmedAppointments = await Appointment.countDocuments({
            business: businessId,
            status: 'Confirmed',
            startTime: { $gte: startOfDay(now), $lte: endOfDay(now) },
        });

        // Count bookings that are pending approval.
        const pendingBookings = await Appointment.countDocuments({
            business: businessId,
            status: { $in: ['Pending', 'Requested'] },
        });

        // Calculate estimated revenue from confirmed appointments over the last 7 days.
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        
        const recentConfirmedAppointments = await Appointment.find({
            business: businessId,
            status: 'Confirmed',
            startTime: { $gte: sevenDaysAgo },
        }).populate('service', 'price');
        
        const weeklyRevenue = recentConfirmedAppointments.reduce((sum, appt) => {
            const price = appt.service ? appt.service.price : 0;
            return sum + price;
        }, 0);

        // Fetch the 5 most recent booking activities for the activity feed.
        const recentActivity = await Appointment.find({
            business: businessId,
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('service', 'name')
        .populate('staff', 'name');


        res.status(200).json({
            success: true,
            summary: {
                todayAppointments: todayConfirmedAppointments,
                pendingBookings: pendingBookings,
                weeklyRevenue: weeklyRevenue.toFixed(2),
                recentActivity: recentActivity,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};