const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const users = require('../schema/UserSchema');
const { generateOtp, sendOtpEmail, sendPasswordResetSuccessEmail } = require('../middleware/emailService');

// Request OTP for password reset
//@desc Send OTP to email for password reset
//@route POST /api/users/forgot-password
//@access public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Find user by email
        const user = await users.findOne({ email });
        
        // Always return success to prevent email enumeration
        if (!user) {
            console.log('Password reset requested for non-existent email:', email);
            return res.json({ 
                success: true,
                message: 'If an account with that email exists, an OTP has been sent.' 
            });
        }

        // Generate 6-digit OTP
        const otp = generateOtp();
        
        // Save OTP to user (expires in 10 minutes)
        user.resetOtp = otp;
        user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        console.log(`OTP generated for ${email}: ${otp}`);

        // Send OTP email
        const emailResult = await sendOtpEmail(user.email, user.name, otp);

        if (emailResult.success) {
            res.json({ 
                success: true,
                message: 'If an account with that email exists, an OTP has been sent.',
                email: user.email // Return email for frontend
            });
        } else {
            console.error('Failed to send OTP email:', emailResult.error);
            // Clear OTP if email failed
            user.resetOtp = null;
            user.resetOtpExpires = null;
            await user.save();
            
            res.status(500).json({ 
                success: false,
                message: 'Error sending OTP. Please try again.' 
            });
        }

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error processing password reset request' 
        });
    }
});

// Verify OTP
//@desc Verify OTP for password reset
//@route POST /api/users/verify-otp
//@access public
const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ 
            success: false,
            message: 'Email and OTP are required' 
        });
    }

    try {
        // Find user by email and valid OTP
        const user = await users.findOne({
            email,
            resetOtp: otp,
            resetOtpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid or expired OTP' 
            });
        }

        // OTP is valid
        res.json({ 
            success: true,
            message: 'OTP verified successfully',
            email: user.email
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error verifying OTP' 
        });
    }
});

// Reset Password after OTP verification
//@desc Reset password after OTP verification
//@route POST /api/users/reset-password
//@access public
const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ 
            success: false,
            message: 'Email, OTP and new password are required' 
        });
    }

    try {
        // Find user by email and valid OTP
        const user = await users.findOne({
            email,
            resetOtp: otp,
            resetOtpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid or expired OTP' 
            });
        }

        // Check if new password is different from current password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: 'New password cannot be the same as current password'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and clear OTP
        user.password = hashedPassword;
        user.resetOtp = null;
        user.resetOtpExpires = null;
        await user.save();

        // Send success email
        await sendPasswordResetSuccessEmail(user.email, user.name);

        res.json({ 
            success: true,
            message: 'Password reset successfully. You can now login with your new password.' 
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error resetting password' 
        });
    }
});

// Resend OTP
//@desc Resend OTP
//@route POST /api/users/resend-otp
//@access public
const resendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await users.findOne({ email });
        
        if (!user) {
            return res.json({ 
                success: true,
                message: 'If an account with that email exists, a new OTP has been sent.' 
            });
        }

        // Generate new OTP
        const otp = generateOtp();
        
        // Update OTP
        user.resetOtp = otp;
        user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        console.log(`New OTP generated for ${email}: ${otp}`);

        // Send new OTP email
        const emailResult = await sendOtpEmail(user.email, user.name, otp);

        if (emailResult.success) {
            res.json({ 
                success: true,
                message: 'New OTP has been sent to your email.',
                email: user.email
            });
        } else {
            res.status(500).json({ 
                success: false,
                message: 'Error sending OTP. Please try again.' 
            });
        }

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error resending OTP' 
        });
    }
});

module.exports = {
    forgotPassword,
    verifyOtp,
    resetPassword,
    resendOtp
};