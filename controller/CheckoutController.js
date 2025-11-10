const mCheckouts = require('../config/MockData').mCheckouts;
const mBooks = require('../config/MockData').mBooks;
const mAuthors = require('../config/MockData').mAuthors;
const mUsers = require('../config/MockData').mUsers;

const checkouts = require('../schema/CheckoutSchema')
const books = require('../schema/BooksSchema')
const users = require('../schema/UserSchema')
const asynchandler = require("express-async-handler");
const { checkout } = require('../routes/User');


// CheckOut a Book by Id
//@desc Checkout a book
//@route POST /api/checkout/:bookId
//@access private
const checkoutBook = asynchandler( async (req,res) => {
   const bookid = req.params.bookId // take the id from parameter 
//    console.log(bookid)
//    console.log(req.user.user.name)
   const book = await books.findOne({bookid: bookid})
   console.log(book)
   console.group(book.copies)
   
   const checkoutDate = new Date(); // define current date 
   const dueDate = new Date()+14*24*60*60*1000; // 2 weeks from checkout date 
   if(!book){
    return res.status(404).json({message: 'Book not Found'});

   }
   
   else{ 
    let stack = 1; // default number of copies 
    if(req.body){
        stack = parseInt(req.body.copies) // see if the number of copies are provided in the body 
        console.log(stack)
    }
    console.log(stack)
    console.log(req.user.user.email)
    console.log(stack > book.copies)
    if(book.status === 'Unavailable' || stack > book.copies ){ // if the copies of the book is less than 1 then you can't checkout 
        return res.status(400).json({message: 'No Copies Available for Checkout'})
    }
    const newCheckout = {
        
        
        book: book.name,
        user:  req.user.user.name, 
        email: req.user.user.email,
        copies:  stack, 
        checkoutDate: checkoutDate,
        dueDate: dueDate,
        returnDate: null //will be updated once it's returned 

    }
    await checkouts.create(newCheckout)
    // Decrease the Number of Copies 
    book.copies -= newCheckout.copies;
    if(book.copies < 1){
        book.status = 'Unavailable' // if book copies are less than 1 then the status is unavailable. 
    }
    await book.save(); //save the update book data 
    await books.findByIdAndUpdate(book.id, book, {new: true})

    res.status(201).json({message: 'Book Checked Out Successfully', checkout: newCheckout})
   }

})


// Return a Book by Id
//@desc Return a Book by Id
//@route PUT /api/checkout/return/:checkoutid
//@access private
const returnBook = asynchandler( async (req,res) => {
   const checkout = req.params.checkoutid
   console.log(checkout)
   const checkoutRecord = await checkouts.findById(checkout) // find the checkout by the record id 
   console.log(checkoutRecord)
   const book = await books.findOne({name: checkoutRecord.book})
   if(!checkoutRecord){ // check if Record exsits 
    return res.status(404).json({message: 'No Record Found '});
   }
   
   const nullflag = checkoutRecord.returnDate
   console.log(nullflag) 
   if(nullflag){ // check if the book is retunred already 
    return res.status(400).json({message: 'No Active Checkout record Found , Book already Returned '});

   }
   else{
    checkoutRecord.returnDate = new Date();
    // Increasre the Number of Copies
    book.copies += checkoutRecord.copies; // increase the amount of copies that's been returned 
    if(book.copies > 0){ // if the copies are now more than 0 then status unavailable 
        book.status = 'Available'
    }
    await book.save(); // save the updated book data 
    await books.findByIdAndUpdate(book.id, book, {new: true})
    await checkoutRecord.save() // save the retrun date  

    res.json({message: 'Book Returned Successfully', checkoutRecord})
   }
})

// Get PErsonal Checkout History
//@desc Get PErsonal Checkout History
//@route GET /api/checkout/me
//@access private
const getPersonalCheckoutHistory = asynchandler( async (req,res) => {
    const email = req.user.user.email
    console.log(email)
    const myrecords = await checkouts.find({email: email}) // Find records through email 
    console.log(myrecords)
    if(!myrecords){
        return res.status(404).json({message: "No Records FOund "})

    }
    return res.status(200).json({message: myrecords}) // return user's personal records 
})

// Get ALl Checkout Records  
//@desc GEt All checkout Records
//@route GET /api/checkout/all
//@access private(admin)
const getAllCheckoutRecords = asynchandler( async (req,res) => {
    const allrecords = await checkouts.find() // list all the checkut records 
    if(!allrecords){
        return res.status(404).json({message: "No records found "})
        
    }
    return res.status(200).json({message: "ALL RECORDS", allrecords})
})

module.exports = {checkoutBook, returnBook, getPersonalCheckoutHistory, getAllCheckoutRecords}