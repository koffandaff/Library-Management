const express = require('express');
const { login, register, currentUser, getAllUsers, deleteUser } = require('../controller/UserController');
const validateToken = require('../middleware/validateToken')
const isAdmin = require('../middleware/Isadmin');
const router = express.Router();


// Login route
router.post('/login', login)

// Register rote

router.post('/register', register)

// Current USer info 
router.get('/current', validateToken, currentUser)

// Get all users
router.get('/', validateToken, isAdmin ,getAllUsers)

// Delete a user
router.delete('/delete/:id', validateToken,  isAdmin, deleteUser)

module.exports= router