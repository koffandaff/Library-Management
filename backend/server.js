const express = require('express');
const connectDb = require('./config/ConnectDb');
const cors = require('cors');
const cookieparser = require('cookie-parser')
require('dotenv').config();

const allowedOrigins = [
    'http://localhost:3001',
    'https://bzf4dfdp-3001.inc1.devtunnels.ms',
    'library-management-seven-kappa.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

const app = express();
const PORT = process.env.PORT;

app.use(cookieparser());
app.use(express.json());
connectDb();

app.use(cors(corsOptions));

// Routes
app.use('/api/users', require('./routes/User'));
app.use('/api/author', require('./routes/Author'));
app.use('/api/book', require('./routes/Book'));
app.use('/api/checkout', require('./routes/Checkout'));

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});