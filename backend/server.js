const express = require('express');
const connectDb = require('./config/ConnectDb');
const cors = require('cors');
const cookieparser = require('cookie-parser')
require('dotenv').config();

const allowedOrigins = [
    '*',
    'http://localhost:3001/',
]

const corsOptions = {
    origin: 'http://localhost:3001', 
    credentials: true, // ← IMPORTANT for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

const app = express();
const PORT = process.env.PORT; // not using env variables for simplicity
app.use(cookieparser())
app.use(express.json()); // Middleware to parse JSON bodies

connectDb(); // Connect to Database


app.use(cors(corsOptions))

// Routes
app.use('/api/users', require('./routes/User')) // Authentication routes
app.use('/api/author', require('./routes/Author')) // Author routes
app.use('/api/book', require('./routes/Book')) // Book routes
app.use('/api/checkout' , require('./routes/Checkout')) // Checkout Routes



app.listen(PORT, () => {
    console.log(`Server is runnin on port: ${PORT}`)
})