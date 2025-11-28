const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    refreshToken: {
        type: String,
        default: null
    },
    // OTP fields
    resetOtp: {
        type: String,
        default: null
    },
    resetOtpExpires: {
        type: Date,
        default: null
    }
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema, 'users');