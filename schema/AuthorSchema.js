const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        required: false,
        default : 'Bio not availabke '
    }

}, {timestamps: true})

module.exports = mongoose.model('authors', AuthorSchema)