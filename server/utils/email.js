/*
 * This file handles email notifications for the application.
 * It uses Nodemailer to send transactional emails like booking confirmations.
 */

const nodemailer = require('nodemailer');

// Configures the email transport service using SMTP settings from environment variables.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Sends an email to a specified recipient with a subject and HTML body.
exports.sendEmail = async (to, subject, htmlMessage) => {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'AppointEase'} <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: htmlMessage,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Generates a formatted HTML email template for confirming a new appointment.
exports.getConfirmationHtml = (appointment, business) => {
    const formattedDate = appointment.startTime.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', timeZone: business.config.timezone
    });
    const formattedTime = appointment.startTime.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', timeZone: business.config.timezone
    });

    return `
    <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Booking Confirmed!</h1>
        </div>
        <div style="padding: 24px;">
            <p style="font-size: 16px;">Hi ${appointment.client.name},</p>
            <p>Your appointment with <strong>${business.businessName}</strong> has been successfully booked.</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Service:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${appointment.service.name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Date:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${formattedDate}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Time:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${formattedTime} (${business.config.timezone})</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0;"><strong>Staff:</strong></td>
                    <td style="padding: 8px 0; text-align: right;">${appointment.staff.name}</td>
                </tr>
            </table>

            <p style="text-align: center; margin-top: 30px;">
                <a href="${process.env.CLIENT_URL}/my-bookings" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 20px; font-weight: bold;">
                    View My Bookings
                </a>
            </p>
        </div>
        <div style="background-color: #f7f7f7; padding: 15px; text-align: center; color: #718096; font-size: 12px;">
            <p>Thank you for choosing ${business.businessName}.</p>
        </div>
    </div>
    `;
};