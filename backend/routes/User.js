const express = require('express');
const { login, register, currentUser, refreshTokenWithRotation,logout, getAllUsers, deleteUser } = require('../controller/UserController');
const validateToken = require('../middleware/validateToken')
const { 
    forgotPassword, 
    verifyOtp, 
    resetPassword,
    resendOtp 
} = require('../controller/PasswordController');

const isAdmin = require('../middleware/Isadmin');
const router = express.Router();


// Login route
router.post('/login', login)

// Register rote

router.post('/register', register)

// refreshtoken rotation lol
router.post('/refresh', refreshTokenWithRotation)

// Password reset routes (OTP based)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp', verifyOtp)
router.post('/reset-password', resetPassword)
router.post('/resend-otp', resendOtp)


// Current USer info 
router.get('/current', validateToken, currentUser)

// Get all users
router.get('/', validateToken, isAdmin ,getAllUsers)

// Delete a user
router.delete('/delete/:id', validateToken,  isAdmin, deleteUser)

//logout
router.post('/logout', validateToken, logout);

module.exports= router