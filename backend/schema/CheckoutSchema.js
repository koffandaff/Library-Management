const mongoose = require("mongoose");
const { checkout } = require("../routes/User");
const Schema = mongoose.Schema;

const CheckoutSchema = new Schema({
    
    user: {
        type: String,
        
        required: true
    },
    email: {
        type: String,
        
    },
    book: {
        type: String,
        ref: 'books',
        required: true
    },
    copies: {
        type: Number,
        required: true,
        default: 1
    },
    checkoutDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: false,
        default: null
    }
}, {timestamps: true})

module.exports = mongoose.model('checkouts', CheckoutSchema)