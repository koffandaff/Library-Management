const mAuthors = require('../config/MockData').mAuthors;
const authors = require('../schema/AuthorSchema')
const mUsers = require('../config/MockData').mUsers;
const mBooks = require('../config/MockData').mBooks;
const mCheckouts = require('../config/MockData').mCheckouts;
const asyncHandler = require('express-async-handler')


// Create a New Author
//@desc Create am author
//@route POST /api/author/
//@access private
const createAuthor = asyncHandler( async (req,res) => {
    const {name, bio} = req.body;
    if(!name || !bio){
        return res.status(400).json({message: 'Please Proivde all required Fields'})
    }
    // Checks if the author exists 
    const authorExists = await authors.findOne({name: name})
    if(authorExists){ 
        return res.status(400).json({message: 'Author already exists'})
    }
    const newAuthor = {
        
        name,
        bio
    }
    await authors.create(newAuthor) // creates an author 
    res.status(201).json({message: 'Author Created Successfully', author: newAuthor})
})

// Get ALl authors
//@desc Get all authors
//@route GET /api/author/
//@access public
const getAllAuthors = asyncHandler ( async (req,res) => {
    const allauthor = await authors.find({}) // gets  all the author 
    res.json(allauthor)
})


// Get an Author by Id
//@desc Get an Author By Id
//@route GET /api/author/:id
//@access public
const getAuthorById = asyncHandler ( async (req,res) => {
    const author = await authors.findById(req.params.id)
    console.log(author)
    if(!author){
        return res.status(404).json({message: 'Author not FOund'})
    }
    else{
        res.json(author)
    }
})


// LUpdate an Author
//@desc Update an Author
//@route PUT /api/author/:id
//@access private
const updateAuthor = asyncHandler( async (req,res) => {
    const author = await authors.findById(req.params.id)
    if(!author){
        return res.status(404).json({message: 'Author not FOund'})
    }
    const {name, bio} = req.body; 
    if(name) author.name = name; // update names if provided 
    if(bio) author.bio = bio; // updates bio if that's provided 
    await author.save(); // save the updates 
    await authors.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.json({message: 'Author Updated Successfully', author})
})

// Delete an Author
//@desc Delete an Author
//@route DELETE /api/author/:id
//@access private
const deleteAuthor = asyncHandler( async (req,res) => {
    const author = await authors.findById(req.params.id)
    if(!author){
        return res.status(404).json({message: 'Author not FOund'})
    }
    
    await authors.findByIdAndDelete(req.params.id) // deletes the author by given id 
    res.json({message: 'Author Deleted Successfully', author})
})

module.exports = { createAuthor, getAllAuthors, getAuthorById, updateAuthor, deleteAuthor}