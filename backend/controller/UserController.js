const express = require('express');
const { validateEmail, validatePassword } = require('../utility/Validemailandpass');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const users = require('../schema/UserSchema');

// Login a user 
const login = asyncHandler( async (req,res) => {
    const {email, password} = req.body;
    
    if(!email || !password){
        return res.status(400).json({message: 'All fields are required'})
    }

    const user = await users.findOne({email: email});
    if(!user){
        return res.status(401).json({message: 'Invalid Credentials'})
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(401).json({message: 'Invalid Credentials'})
    }

    // Create access token
    const accessToken = jwt.sign(
        {
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            } 
        }, 
        process.env.AT_KEY,
        {expiresIn: '5m'} // Increased for testing
    );

    // Create refresh token
    const refreshToken = jwt.sign(
        {
            user: {
                id: user._id.toString()
            }
        },
        process.env.RT_KEY,
        {expiresIn: '7d'}
    );

    // Store refresh token in database
    try {
        user.refreshToken = refreshToken;
        await user.save();
    } catch (error) {
        console.error('Error saving refresh token:', error);
        return res.status(500).json({message: 'Error during login process'});
    }

    // Send refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/' // Important: ensure cookie is available on all routes
    });

    res.json({
        message: 'Login Successful', 
        accessToken,
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
} );

// Refresh Token with Rotation
const refreshTokenWithRotation = asyncHandler(async (req, res) => {
    // Get refresh token from httpOnly cookie
    const oldRefreshToken = req.cookies.refreshToken;
    
    console.log('Refresh endpoint hit - Cookies:', req.cookies);
    
    if (!oldRefreshToken) {
        console.log('No refresh token in cookies');
        return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify the old refresh token signature
    let decoded;
    try {
        decoded = jwt.verify(oldRefreshToken, process.env.RT_KEY);
        console.log('Token decoded for user:', decoded.user.id);
    } catch (error) {
        console.log('Refresh token verification failed:', error.message);
        res.clearCookie('refreshToken');
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Find user and validate refresh token matches database
    const user = await users.findById(decoded.user.id);
    if (!user) {
        console.log('User not found for id:', decoded.user.id);
        res.clearCookie('refreshToken');
        return res.status(403).json({ message: 'User not found' });
    }

    console.log('User found:', user._id);
    console.log('Stored token exists:', !!user.refreshToken);
    console.log('Tokens match:', user.refreshToken === oldRefreshToken);

    if (user.refreshToken !== oldRefreshToken) {
        console.log('Refresh token mismatch - possible theft');
        user.refreshToken = null;
        await user.save();
        res.clearCookie('refreshToken');
        return res.status(403).json({ message: 'Refresh token revoked' });
    }

    // Create new access token
    const newAccessToken = jwt.sign(
        {
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            }
        },
        process.env.AT_KEY,
        { expiresIn: '5m' }
    );

    // Create new refresh token (rotation)
    const newRefreshToken = jwt.sign(
        {
            user: {
                id: user._id.toString()
            }
        },
        process.env.RT_KEY,
        { expiresIn: '7d' }
    );

    // Update database with new refresh token
    try {
        user.refreshToken = newRefreshToken;
        await user.save();
    } catch (error) {
        console.error('Error updating refresh token:', error);
        return res.status(500).json({ message: 'Error refreshing token' });
    }

    // Set new refresh token in cookie
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
    });

    res.json({
        accessToken: newAccessToken,
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// Logout user
const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
        try {
            // Find user and clear refresh token from database
            const user = await users.findById(req.user.id);
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    });

    res.json({ message: 'Logged out successfully' });
});

// Register a user 
const register = asyncHandler (async (req,res) => {
    const {name, email, password, role, adminkey} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message: 'Please provide all required Fields: name ,email and password'})
    }
    
    const useravail = await users.findOne({email: email});
    if(useravail){
        return res.status(400).json({message: 'User already exists with this email'})
    }

    if(!validateEmail(email)){
        return res.status(400).json({message: "Please enter a valid email address"})
    }
    
    if(!validatePassword(password)){
        return res.status(400).json({message: "Password must be atleast 8 characters long and contain at least one letter and one number"})
    }

    if(role && role !== 'user' && role !== 'admin'){
        return res.status(400).json({message: 'Invalid role specified'})
    }
    
    if(role === 'admin'){
        if(!adminkey || adminkey !== '123'){
            return res.status(403).json({message: 'Invalid admin key or not provided'})
        }
    }

    const hashedPassword = bcrypt.hashSync(password,10);
    
    const newUser = {
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        refreshToken: null
    };
    
    try {
        const createdUser = await users.create(newUser);
        console.log("New User Registered:", createdUser);
        res.status(201).json({
            message: 'User Registered Successfully', 
            user: {
                id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email,
                role: createdUser.role
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({message: 'Error creating user account'});
    }
} );

// Current User Info
const currentUser = (req,res) => {
    res.json({user: req.user});
}

// Get all users 
const getAllUsers = asyncHandler(async (req,res) => {
    try {
        const alluser = await users.find().select('-password -refreshToken');
        res.json({users: alluser});
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({message: 'Error fetching users'});
    }
});

// Delete a user 
const deleteUser = asyncHandler( async(req,res) => {
    try {
        const user = await users.findById(req.params.id);
        if(!user){
            return res.status(404).json({message: "User Not Found"});
        }
        await users.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "User deleted Successfully", 
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({message: 'Error deleting user'});
    }
});

module.exports = { 
    login, 
    register, 
    currentUser, 
    getAllUsers, 
    deleteUser, 
    refreshTokenWithRotation, 
    logout 
};