const express = require('express');
const { createAuthor, getAllAuthors, getAuthorById, updateAuthor, deleteAuthor } = require('../controller/AuthorController');
const validateToken = require('../middleware/validateToken');
const Isadmin = require('../middleware/Isadmin');
const router = express.Router();

// Create a new Author
router.post('/', validateToken, Isadmin ,createAuthor)

// Get All authors 
router.get('/', validateToken, getAllAuthors)

// Get an Author by id
router.get('/:id', validateToken, getAuthorById)

// Update and Author by Id
router.put('/:id', validateToken, Isadmin, updateAuthor)

// Delete an Author by Id
router.delete('/:id', validateToken, Isadmin, deleteAuthor)

module.exports = router;