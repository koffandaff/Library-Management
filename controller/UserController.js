const express = require('express');
const { validateEmail, validatePassword } = require('../utility/Validemailandpass');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')

const mAuthors = require('../config/MockData').mAuthors;
const mUsers = require('../config/MockData').mUsers;
const validateToken = require('../middleware/validateToken');
const users = require('../schema/UserSchema');

// Login a user 
//@desc Login a user
//@route POST /api/user/login
//@access public
const login = asyncHandler( async (req,res) => {
    const {email, password} = req.body;
    // checking if email and password are provided 
    if(!email || !password){
        return res.status(400).json({message: 'All fields are required'})
    }

    // See if user exsits 
    const user = await users.findOne({email: email});
    if(!user){
        return res.status(401).json({message: 'Invalid Credentials'}) // Don't reveal if user exists
    }
    //. uf user exsits then compare the password 
    else{
        if( await !bcrypt.compareSync(password, user.password)){
            return res.status(401).json({message: 'Invalid Credentials'})
        }
        else{ // if password matches then creation of jwt token 
            // Create access token (short-lived)
            const accessToken = jwt.sign(
                {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                } 
            }, 
                process.env.ACCESS_TOKEN_SECRET || "Dhruvil12345", // this should be in env variable but it's fine fro now
                {expiresIn: '10s'}
            );

            // Create refresh token (long-lived)
            const refreshToken = jwt.sign(
                {
                    user: {
                        id: user.id
                    }
                },
                process.env.REFRESH_TOKEN_SECRET || "Dhruvil12345Refresh", // Different secret for refresh tokens
                {expiresIn: '7d'}
            );

            // Store refresh token in database for validation
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
                secure: process.env.NODE_ENV === 'production', // HTTPS only in production
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.json({
                message: 'Login Successful', 
                user: user.name, 
                accessToken,
                userInfo: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            })
        }
    }
} )

// Refresh Token with Rotation
//@desc Refresh access token with rotation for security
//@route POST /api/user/refresh
//@access public
const refreshTokenWithRotation = asyncHandler(async (req, res) => {
    // Get refresh token from httpOnly cookie
    const oldRefreshToken = req.cookies.refreshToken;
    
    if (!oldRefreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify the old refresh token signature
    let decoded;
    try {
        decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET || "Dhruvil12345Refresh");
    } catch (error) {
        // Clear invalid cookie
        res.clearCookie('refreshToken');
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Find user and validate refresh token matches database
    const user = await users.findById(decoded.user.id);
    if (!user) {
        res.clearCookie('refreshToken');
        return res.status(403).json({ message: 'User not found' });
    }

    if (user.refreshToken !== oldRefreshToken) {
        // Token mismatch - possible theft detected
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
        process.env.ACCESS_TOKEN_SECRET || "Dhruvil12345",
        { expiresIn: '15m' }
    );

    // Create new refresh token (rotation)
    const newRefreshToken = jwt.sign(
        {
            user: {
                id: user._id.toString()
            }
        },
        process.env.REFRESH_TOKEN_SECRET || "Dhruvil12345Refresh",
        { expiresIn: '7d' }
    );

    // Update database with new refresh token (invalidate old one)
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
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
        accessToken: newAccessToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// Logout user
//@desc Logout user and clear tokens
//@route POST /api/user/logout
//@access private
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
            // Continue with logout even if DB operation fails
        }
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.json({ message: 'Logged out successfully' });
});

// Register a user 
//@desc Register a user
//@route POST /api/user/register
//@access public
const register = asyncHandler (async (req,res) => {
    const {name, email, password, role, adminkey} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message: 'Please provide all required Fields: name ,email and password'})
    }
    // if user already exits 
    const useravail = await users.findOne({email: email});
    if(useravail){
        return res.status(400).json({message: 'USer already exists with this email '})
    }

    // Validate Email and Password

    if(!validateEmail(email)){
        return res.status(400).json({message: "Please enter a valid email address"})
    }
    
    if(!validatePassword(password)){
        return res.status(400).json({message: "Password must be atleast 8 characters long and contain at least one letter and one number"})
    }

    if(role && role !== 'user' && role !== 'admin'){
        return res.status(400).json({message: 'Invalid ROle specified'})
    }
    // if role addmin then check the admin key 
    if(role === 'admin'){
        if(adminkey && adminkey === '123'){ // proceed ( key should be in env but for simplicity it's here )
        }
        else{
            return res.status(403).json({message: 'Invalid ADmin key or not provided'})
        }
    }

    const hashedPassword = bcrypt.hashSync(password,10); // Hashing of the password before storing 
    

    const newUser = {
        
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        refreshToken: null // Initialize with no refresh token

    }
    //Creation of user 
    try {
        const createdUser = await users.create(newUser);
        // users.findById(createdUser._id).then((user) => {
        //    newUser._id = user._id; 
        // })
        console.log("New User Regusterd:", createdUser)
        res.status(201).json({
            message: 'User REgsistered Successfully', 
            user: {
                id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email,
                role: createdUser.role
            }
        })
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({message: 'Error creating user account'});
    }
} )

// Current User Info
//@desc Info of Current User
//@route GET /api/user/current
//@access private
const currentUser = (req,res) => {
    // req.user is set in the validateToken Middleware
    // we will call it here
    res.json({user: req.user})
}

// Get all users 
//@desc Info of Current User
//@route GET /api/user/
//@access private
const getAllUsers = asyncHandler(async (req,res) => {
    //list all users 
    try {
        const alluser = await users.find().select('-password -refreshToken'); // Exclude sensitive fields
        res.json({users: alluser})
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({message: 'Error fetching users'});
    }
})

// Delete a user 
//@desc Delete a user
//@route DELETE /api/user/delete/:id
//@access private
const deleteUser = asyncHandler( async(req,res) => {
    try {
        const user = await users.findById(req.params.id);
        if(!user){ // check if user exsits
            return res.status(404).json({message: "User Not Found"})
        }
        else{
            await users.findByIdAndDelete(req.params.id); // delete the user by id 
            res.status(200).json({message: "User deleted SuccessFully", user: {
                id: user._id,
                name: user.name,
                email: user.email
            }}) 
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({message: 'Error deleting user'});
    }
})

module.exports = { 
    login, 
    register, 
    currentUser, 
    getAllUsers, 
    deleteUser, 
    refreshTokenWithRotation, 
    logout 
};