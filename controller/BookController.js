const mBooks = require('../config/MockData').mBooks;
const mAuthors = require('../config/MockData').mAuthors;
const authors = require('../schema/AuthorSchema')
const books = require('../schema/BooksSchema')
const asychandler = require('express-async-handler')

// Create a New Book
//@desc Create a Book
//@route POST /api/book/
//@access private
const createBook = asychandler( async (req,res) => {
    const {name,  bookid, authorid, authorname,  category, copies, status} = req.body;
    if(!name ||  !authorname || !category || !bookid || !copies){
        return res.status(400).json({message: 'Please provide all required fields: name , bookid , (authorid or authorname) , category , copies '})
    }
    
    

    const bookExists = await books.findOne({name: name}) // check if book exists 
    

    if(bookExists){ // if tyhe book exsits then increase the amount of copies of the book 
        bookExists.copies += copies
        await bookExists.save()
        await books.findByIdAndUpdate(bookExists.id, bookExists, {new: true})
        return res.status(200).json({message: 'Book already exists, Increased copy count', book: bookExists})
    }
    else{
        console .log(bookExists)
        const author = await authors.findOne({name: authorname}) // see if the author exists 
        if(!author){ // if not then create an Author 
            const newAuthor = {
                name: authorname,
                bio: 'NA'
            }
            await authors.create(
                newAuthor
            )
        }
        const newBook = {
            
            name,
            authorname: authorname,
            bookid,
            category,
            copies,
            status: status || 'Available'
            
        }
        await books.create(newBook);
        res.status(201).json({message: 'Book Created Successfully', book: newBook})
    }
})

// Get ALl Books
//@desc Get all Books
//@route GET /api/book/
//@access public
const getAllBooks = asychandler ( async (req,res) => {
    const allbooks = await books.find() // get all the books f
    if(!allbooks){
        return res.status(401).json({message: "No Book FOund [There's no book in the Library "})
    }
    else{
        return res.status(200).json(allbooks)
    }
})


// Get a Book by name
//@desc Get a Book By name
//@route GET /api/book/:name
//@access public
const getBookById = asychandler( async (req,res) => {
    try {
            const book = await books.findOne({name : req.params.name}) // check if the book exists with that name 
    if(!book){
        return res.status(404).json({message: 'Could not find the book with that that name ' })
     
    }
    else{
        res.json(book) // return the book if exsits 
    }
    } catch (error) {
        console.log('---------', error)
    }

})


// LUpdate a Book
//@desc Update a Book
//@route PUT /api/book/:id
//@access private
const updateBook = asychandler( async (req,res) => {
    const book = await books.findById(req.params.id)
    if(!book){
        return res.status(404).json({message: 'Book not Found'})
     
    }

    const {name, authorid,  category, copies, status} = req.body; // find all the given const 
    // Update whatever is given 
    if(name) book.name = name;
    if(authorid) {
        book.authorname = await authors.findById(req.params.authorid) || book.authorname
    }
    if(category) book.category = category;
    if(copies) book.copies = copies;
    if(status) book.status = status;
    await book.save(); // save the updated data 
    await books.findByIdAndUpdate(req.params.id, book, {new: true})
    res.json({message: 'Book Updated successfully', book})
})

// Delete an Book
//@desc Delete a Book
//@route DELETE /api/book/:id
//@access private
const deleteBook = asychandler( async (req,res) => {
    const book = await books.findById(req.params.id) // finds the book by id 
    if(!book){
        return res.status(404).json({message: 'Book not Found'})
     
    }
    await books.findByIdAndDelete(req.params.id) // deletes it if found 
    res.json({message: 'Book Deleted Successfully', book})
})

// Get a Book by Category
//@desc Get a Book By Category
//@route GET /api/book/category
//@access public
const getBookByCategory = asychandler(async (req, res) => {
    const { category } = req.body // or req.query if using query params
    if (!category) {
        return res.status(400).json({ message: "Enter Category" })
    }
    const cbooks = await books.find({ category: category })
    
    // Fix: Check if array is empty, not if it's falsy
    if (!cbooks || cbooks.length === 0) {
        return res.status(404).json({ message: 'No books found in this category' })
    } else {
        return res.status(200).json(cbooks)
    }
})

// Get a Book by author
//@desc Get a Book By author
//@route GET /api/book/author
//@access public
const getBookByAuthor = asychandler(async (req, res) => {
    const { authorname } = req.body; 
    if (!authorname) {
        return res.status(400).json({ message: "Enter Author Name" })
    }
    const abooks = await books.find({ authorname: authorname })
    if (!abooks || abooks.length === 0) { 
        return res.status(404).json({ message: 'No books found for this author' })
    }
    else {
        res.json(abooks)
    }
})

// module.exports = { getBookByCategory}
module.exports = { createBook, getAllBooks, getBookById, updateBook, deleteBook, getBookByCategory, getBookByAuthor}