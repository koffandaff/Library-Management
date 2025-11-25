const express = require('express');
const { createBook, getAllBooks, getBookById, updateBook, deleteBook, getBookByCategory, getBookByAuthor } = require('../controller/BookController');
const validateToken = require('../middleware/validateToken');
const Isadmin = require('../middleware/Isadmin');
const router = express.Router();

// Create a New Book
router.post('/', validateToken, Isadmin, createBook)

// Get all the available books
router.get('/', validateToken, getAllBooks)

// GEt books Based on Author - MOVED BEFORE DYNAMIC ROUTE
router.get('/author', validateToken, getBookByAuthor)

// GEt books based on categories - MOVED BEFORE DYNAMIC ROUTE
router.get('/category', validateToken, getBookByCategory)

// Get an Individual book by name - MOVED AFTER SPECIFIC ROUTES
router.get('/:name', validateToken, getBookById)

// Update a Book by Id
router.put('/:id', validateToken, Isadmin, updateBook)

// Delete a Book By Id
router.delete('/:id', validateToken, Isadmin, deleteBook)

module.exports = router;