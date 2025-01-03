const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
    origin: [
        'https://occasio-10thtig8z-kronodiles-projects.vercel.app',
        'https://occasio-c51z.onrender.com',
        'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Handle preflight requests
app.options('*', cors(corsOptions));

// Health check route
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/api/events', eventRoutes);

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Atlas connected');
        // Start server only after successful DB connection
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
        
        // Handle server errors
        server.on('error', (error) => {
            console.error('Server error:', error);
            process.exit(1);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

module.exports = app;