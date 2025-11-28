const express = require('express');
const { checkoutBook, returnBook, getPersonalCheckoutHistory, getAllCheckoutRecords } = require('../controller/CheckoutController');
const validateToken = require('../middleware/validateToken');
const Isadmin = require('../middleware/Isadmin');
const router = express.Router();

// Checkout a book
router.post('/:bookId', validateToken, checkoutBook)

// Return a book 
router.put('/return/:checkoutid', validateToken, returnBook)

// Get Personal checkout History 
router.get('/me', validateToken, getPersonalCheckoutHistory)

// Get All Checkout Records (Admin)
router.get('/all', validateToken, Isadmin, getAllCheckoutRecords)


module.exports = router;