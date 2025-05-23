const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAdmin } = require('../middleware/authMiddleware');


// Route for user registration
router.post('/register', userController.register);

// Route for otp verification
router.post('/verify-otp', userController.verifyOTP);
router.post('/resend-otp', userController.resendOTP);

// Route for user login
router.post('/login', userController.login);

// Request Password Reset (Generate OTP)
router.post('/reset-password/request', userController.resetPasswordRequest);


// Verify OTP and Update Password
router.post('/reset-password/verify', userController.resetPasswordVerify);

// Get all users email and id
router.get('/allUsers', isAdmin, userController.getAllUsers);
// Resend OTP
// router.post('/reset-password/resend', userController.resetPasswordResend);

module.exports = router;
