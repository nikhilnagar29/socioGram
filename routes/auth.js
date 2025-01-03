const express = require('express');
const routes = express.Router();
require('dotenv').config();

// Import required modules and utilities
const UserModel = require('../models/usermodel');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const { promisify } = require('util'); 
const jwt = require('jsonwebtoken');
const debug = require('debug')('development:auth');
const emailUtil = require('../utils/mailUtil');

// Redis client configuration
const redis = require('redis');   
const client = redis.createClient();

client.on('error', (err) => debug('Redis Error:', err));

client.connect()
    .then(() => debug('Redis connected successfully.'))
    .catch((err) => debug('Error connecting to Redis:', err));

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

        if (!client.isOpen) await client.connect();

        const key = email.toString();
        const value = hashedOtp.toString();
        const expiryTime = 300; // 5 minutes in seconds

        await client.setEx(key, expiryTime, value);
        debug('OTP stored successfully');

        emailUtil.sendOtp(email, otp, name);

        res.redirect(`/newAccount/verification?email=`+encodeURIComponent(email));
    } catch (error) {
        debug('Error in request-otp:', error);
        res.status(500).json({ message: 'Failed to process OTP request' });
    }
});

/**
 * Route: GET /newAccount/verification
 * Renders the OTP verification page
 */
routes.get('/newAccount/verification', (req, res) => {
    const { email } = req.query;
    res.render('otp_page', { email });
});

/**
 * Route: POST /newAccount/verify-otp
 * Verifies the user's OTP and deletes it from Redis if successful
 */
routes.post('/newAccount/verify-otp', async (req, res) => {
    const { otp } = req.body;
    const { email } = req.query;

    if (!email || !otp) return res.redirect('/');

    try {
        const storedOtp = await client.get(email);

        if (!storedOtp) {
            debug('OTP expired or not found for email:', email);
            return res.redirect('/');
        }

        const isOtpValid = await bcrypt.compare(otp, storedOtp);

        if (isOtpValid) {
            await client.del(email);
            debug('OTP verified successfully for email:', email);
            res.redirect(`/password?email=`+encodeURIComponent(email));
        } else {
            debug('Invalid OTP for email:', email);
            res.redirect('/');
        }
    } catch (error) {
        debug('Error in OTP verification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * Route: GET /password
 * Renders the password setup page
 */
routes.get('/password', (req, res) => {
    const { email } = req.query;
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

        const token = jwt.sign(
            { email , _id : updatedUser._id }, 
            'default_secret', 
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