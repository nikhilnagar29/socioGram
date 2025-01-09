const nodemailer = require('nodemailer');
// const config = require('config') ;
// const dbgr = require
const path = require('path') ;
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Adjust the path


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL , // Your Gmail
        pass: process.env.EMAIL_PASS // Your Gmail App Password
    }
});

function sendOtp(email , otp , name = "user"){
    const mailOption = {
        from: process.env.EMAIL ,
        to: email,
        subject: '🔐 Verify Your Email for SocioGram',
        text: `Hi ${name},\n
 Welcome to SocioGram — your gateway to a vibrant social media experience!\n\n
 To ensure the security of your account, please verify your email address by using the One-Time Password (OTP) provided below.\n\n
        🔑 Your OTP is: ${otp}\n\n
 This code will expire in 5 minutes, so please enter it as soon as possible. If you didn’t request this, you can safely ignore this email.\n\n
 If you have any questions or need assistance, feel free to reach out to our support team.\n
 Stay connected,\n
 The SocioGram Team`
    };

    transporter.sendMail(mailOption, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
            return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
        }
    });
}

// ✅ Export the `sendOtp` function properly
module.exports = {
    sendOtp
};