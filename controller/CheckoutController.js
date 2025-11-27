const mCheckouts = require('../config/MockData').mCheckouts;
const mBooks = require('../config/MockData').mBooks;
const mAuthors = require('../config/MockData').mAuthors;
const mUsers = require('../config/MockData').mUsers;

const checkouts = require('../schema/CheckoutSchema')
const books = require('../schema/BooksSchema')
const users = require('../schema/UserSchema')
const asynchandler = require("express-async-handler");

// Get Personal Checkout History
//@desc Get Personal Checkout History
//@route GET /api/checkout/me
//@access private
const getPersonalCheckoutHistory = asynchandler(async (req, res) => {
    try {
        // FIX: Handle both req.user and req.user.user structures safely
        const userData = req.user?.user || req.user;
        const email = userData?.email;
        
        console.log('User data in getPersonalCheckoutHistory:', userData);
        console.log('Fetching checkout history for email:', email);
        
        if (!email) {
            return res.status(400).json({ message: "User email not found in token" });
        }
        
        const myrecords = await checkouts.find({ email: email }); // Find records through email 
        
        console.log('Found records:', myrecords);
        
        if (!myrecords || myrecords.length === 0) {
            return res.status(404).json({ message: "No checkout records found" });
        }
        
        return res.status(200).json({ 
            message: "Checkout history retrieved successfully",
            data: myrecords 
        });
        
    } catch (error) {
        console.error('Error in getPersonalCheckoutHistory:', error);
        return res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
});

// CheckOut a Book by Id
//@desc Checkout a book
//@route POST /api/checkout/:bookId
//@access private
const checkoutBook = asynchandler(async (req, res) => {
    try {
        const bookid = req.params.bookId;
        console.log('Checkout request for book ID:', bookid);
        
        // FIX: Handle both req.user and req.user.user structures safely
        const userData = req.user?.user || req.user;
        
        // Try to find book by bookid (numeric) OR _id (MongoDB)
        let book = await books.findOne({ bookid: bookid });
        
        // If not found by bookid, try by _id
        if (!book) {
            book = await books.findById(bookid);
        }
        
        console.log('Found book:', book);
        
        if (!book) {
            return res.status(404).json({ message: 'Book not Found' });
        }
        
        const checkoutDate = new Date();
        const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 2 weeks from now
        
        let stack = 1;
        if (req.body && req.body.copies) {
            stack = parseInt(req.body.copies);
        }
        
        console.log('Book status:', book.status, 'Copies:', book.copies, 'Requested:', stack);
        
        if (book.status === 'Unavailable' || stack > book.copies) {
            return res.status(400).json({ message: 'No Copies Available for Checkout' });
        }
        
        const newCheckout = {
            book: book.name,
            user: userData?.name,
            email: userData?.email,
            copies: stack,
            checkoutDate: checkoutDate,
            dueDate: dueDate,
            returnDate: null
        };
        
        console.log('Creating checkout:', newCheckout);
        const createdCheckout = await checkouts.create(newCheckout);
        
        // Update book copies
        book.copies = book.copies - stack;
        if (book.copies < 1) {
            book.status = 'Unavailable';
        }
        await book.save();
        
        console.log('Book updated. Remaining copies:', book.copies);
        
        res.status(201).json({ 
            message: 'Book Checked Out Successfully', 
            checkout: createdCheckout 
        });
        
    } catch (error) {
        console.error('Error in checkoutBook:', error);
        res.status(500).json({ 
            message: 'Internal server error during checkout',
            error: error.message 
        });
    }
});

// Return a Book by Id
//@desc Return a Book by Id
//@route PUT /api/checkout/return/:checkoutid
//@access private
const returnBook = asynchandler(async (req, res) => {
    try {
        const checkoutId = req.params.checkoutid;
        const checkoutRecord = await checkouts.findById(checkoutId);
        
        if (!checkoutRecord) {
            return res.status(404).json({ message: 'No Record Found' });
        }
        
        if (checkoutRecord.returnDate) {
            return res.status(400).json({ message: 'No Active Checkout record Found, Book already Returned' });
        }
        
        const book = await books.findOne({ name: checkoutRecord.book });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        checkoutRecord.returnDate = new Date();
        book.copies += checkoutRecord.copies;
        
        if (book.copies > 0) {
            book.status = 'Available';
        }
        
        await book.save();
        await checkoutRecord.save();
        
        res.json({ 
            message: 'Book Returned Successfully', 
            checkoutRecord 
        });
        
    } catch (error) {
        console.error('Error in returnBook:', error);
        res.status(500).json({ 
            message: 'Internal server error during return',
            error: error.message 
        });
    }
});

// Get All Checkout Records  
//@desc Get All checkout Records
//@route GET /api/checkout/all
//@access private(admin)
const getAllCheckoutRecords = asynchandler(async (req, res) => {
    try {
        const allrecords = await checkouts.find();
        
        if (!allrecords || allrecords.length === 0) {
            return res.status(404).json({ message: "No records found" });
        }
        
        return res.status(200).json({ 
            message: "All records retrieved successfully",
            data: allrecords 
        });
        
    } catch (error) {
        console.error('Error in getAllCheckoutRecords:', error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
});

module.exports = { checkoutBook, returnBook, getPersonalCheckoutHistory, getAllCheckoutRecords };