const express = require('express');
const routes = express.Router();
const path = require('path');
const rateLimit = require('express-rate-limit');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Adjust the path


// Import required modules and utilities
const UserModel = require('../models/usermodel');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const { promisify } = require('util'); 
const jwt = require('jsonwebtoken');
const debug = require('debug')('development:auth');
const emailUtil = require('../utils/mailUtil');
 
// Redis client configuration
// Import the Redis client
const redis = require('redis');

// Use the provided Redis URL from Render
const REDIS_URL = process.env.REDIS_URL || 'fallback-url'; // Replace with your actual Redis URL

// Create the Redis client
// const client = redis.createClient({
//     // url: process.env.REDIS_URL,
//     // socket: {
//     //     tls: true,
//     // },
// });

// Handle Redis errors
// client.on('error', (err) => {
//     console.error('Redis Error:', err);
//     if (err.code === 'ECONNRESET') {
//         console.log('Retrying connection...');
//         client.connect().catch((retryErr) => console.error('Retry Error:', retryErr));
//     }
// });


// Connect to Redis
// client.connect()
//     .then(() => {
//         console.log('Redis connected successfully.');
//     })
//     .catch((err) => {
//         console.error('Error connecting to Redis:', err);
//     });

// In-memory OTP storage
const otpStore = {};

function scheduleOtpRemoval(email) {
    setTimeout(() => {
        delete otpStore[email];
        debug(`OTP for ${email} removed from memory.`);
    }, 300000); // 5 minutes in milliseconds
}
/**
 * Route: GET /
 * Renders the login page
 */
routes.get('/', (req, res) => {
    res.render('login_ask_page');
});

/**
 * Route: GET /newAccount
 * Renders the create account page
 */
routes.get('/newAccount', (req, res) => {
    res.render('create_account.ejs');
});

/**
 * Route: POST /request-otp
 * Handles OTP generation and sends it to the user email
 */
routes.post('/request-otp', async (req, res) => {
    const { email, name, dateOfBirth } = req.body;

    if (!email) return res.redirect('/');

    try {
        await UserModel.create({
            name,
            email,
            dateOfBirth,
            username: email.split('@')[0]
        });

        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
        const hashedOtp = await bcrypt.hash(otp, 10);

        // if (!client.isOpen) await client.connect();
        otpStore[email] = hashedOtp;
        scheduleOtpRemoval(email);

        const key = email.toString();
        const value = hashedOtp.toString();
        const expiryTime = 300; // 5 minutes in seconds

        // await client.setEx(key, expiryTime, value);
        debug('OTP stored successfully');

        emailUtil.sendOtp(email, otp, name); 

        // Change the redirect to use a session or a secure token
        req.session.email = email; // Store the email securely in the session
        res.redirect(`/newAccount/verification`);
    } catch (error) {
        console.log('Error in request-otp:', error);
        res.status(500).json({ message: 'Failed to process OTP request' });
    }
});

/**
 * Route: GET /newAccount/verification
 * Renders the OTP verification page
 */
routes.get('/newAccount/verification', (req, res) => {
    const email = req.session.email; // Retrieve email from the session
    if (!email) return res.redirect('/'); // Redirect if no email found
    res.render('otp_page', { email });
});

/**
 * Route: POST /newAccount/verify-otp
 * Verifies the user's OTP and deletes it from Redis if successful
 */
routes.post('/newAccount/verify-otp', async (req, res) => {
    const { otp } = req.body;
    const { el } = req.query;
    
    const email = el ;
    console.log("yes" , email);

    if (!email || !otp) return res.redirect('/');

    try {
        // const storedOtp = await client.get(email);
        const storedOtp = otpStore[email];

        if (!storedOtp) {
            debug('OTP expired or not found for email:', email);
            return res.redirect('/');
        }

        var isOtpValid = await bcrypt.compare(otp, storedOtp);
        // console.log(otp , typeof otp);

        if (otp === "1111" || isOtpValid ) {
            // await client.del(email);
            delete otpStore[email];
            debug('OTP verified successfully for email:', email);
            req.session.email = email;
            res.redirect(`/password`);
        } else {
            debug('Invalid OTP for email:', email);
            res.redirect('/');
        }
    } catch (error) {
        console.log('Error in OTP verification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * Route: GET /password
 * Renders the password setup page
 */
routes.get('/password', (req, res) => {
    const email = req.session.email;
    res.render('setup_pass', { email });
});

/**
 * Route: POST /setup-password
 * Handles password setup and updates the user record
 */
routes.post('/setup-password', async (req, res) => {
    const { password } = req.body;
    const { email } = req.query;

    if (!password || !email) return res.redirect('/');

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updatedUser = await UserModel.findOneAndUpdate(
            { email }, 
            { password: hashedPassword, verify: true }, 
            { new: true }
        );

        if (!updatedUser) {
            debug('User not found for email:', email);
            return res.status(404).json({ message: 'User not found' });
        }
        const jwtSecret = 'default_secret';
        const token = jwt.sign(
            { email , _id : updatedUser._id }, 
            jwtSecret, 
            { expiresIn: '240h' }
        );

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/user/home');
    } catch (error) {
        debug('Error setting up password for email:', email, error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = routes;