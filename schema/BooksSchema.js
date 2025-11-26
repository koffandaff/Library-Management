const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    authorname: {
        type: String,
        ref: 'authors',
        
    },
    bookid: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true
    },
    copies: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['Available', 'Unavailable'],
        default: 'Available'
    }


},{timestamps: true}) 

module.exports = mongoose.model('books', BookSchema);