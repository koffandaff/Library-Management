const express = require('express');
const connectDb = require('./config/ConnectDb');


const app = express();
const PORT = 3000; // not using env variables for simplicity

app.use(express.json()); // Middleware to parse JSON bodies

connectDb(); // Connect to Database

// Routes
app.use('/api/users', require('./routes/User')) // Authentication routes
app.use('/api/author', require('./routes/Author')) // Author routes
app.use('/api/book', require('./routes/Book')) // Book routes
app.use('/api/checkout' , require('./routes/Checkout')) // Checkout Routes



app.listen(PORT, () => {
    console.log(`Server is runnin on port: ${PORT}`)
})