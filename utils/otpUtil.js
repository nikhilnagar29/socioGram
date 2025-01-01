const OtpModel = require('../models/otp'); // Assuming you have an Otp model
const bcrypt = require('bcrypt');

/**
 * Save OTP in the database with expiry
 * @param {string} email - User email
 * @param {string} otp - OTP to store
 */
async function saveOtp(email, otp) {
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 mins from now
    const hashedOtp = await bcrypt.hash(otp, 10); // Hash the OTP before storing

    // Store OTP in the database (create or update if it exists)
    await OtpModel.findOneAndUpdate(
        { email },
        { email, otp , expiry: expiryTime },
    );
}

/**
 * Verify OTP for a user
 * @param {string} email - User email
 * @param {string} otp - OTP to verify
 */
async function findOtp(email) {
    const otpRecord = await OtpModel.findOne({ email });

    return otpRecord ;
}

/**
 * Delete OTP from the database
 * @param {string} email - User email
 */
async function deleteOtp(email) {
    await OtpModel.findOneAndDelete({ email });
}

module.exports = {
    saveOtp,
    matchOtp,
    deleteOtp
};
