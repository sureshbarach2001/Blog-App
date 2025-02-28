const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database'); // MongoDB connection
const redisClient = require('./config/redis'); // Redis connection
const errorHandler = require('./controllers/middleware/errorHandler'); // Custom error handler

// Load environment variables early
require('dotenv').config();
console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET ? "Loaded ✅" : "❌ Not Found");
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET ? "Loaded ✅" : "❌ Not Found");

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// 🔒 Security Middleware (Protect API from common attacks)
app.use(helmet());

// 🌍 CORS Middleware (Allow frontend to access API)
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Default to local frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 📜 Logging Middleware (Monitor API requests)
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Middleware for parsing JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Test Route
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'Server is running successfully' });
});

// 🛠 Routes
app.use('/api/blogs', require('./routes/blogRoutes')); // Blog Routes
app.use('/api/auth', require('./routes/authRoutes')); // Auth Routes

// ❌ Error Handling Middleware (Must be last!)
app.use(errorHandler);

// 🌐 Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

// 🔥 Handle Uncaught Errors & Rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err.message);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    process.exit(1);
});

// 🔄 Graceful Shutdown (Cleanup MongoDB & Redis on exit)
process.on('SIGINT', async () => {
    console.log('🔻 Gracefully shutting down...');
    await redisClient.quit(); // Close Redis connection
    process.exit(0);
});
