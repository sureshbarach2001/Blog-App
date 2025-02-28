const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Logger Middleware
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} at ${new Date().toISOString()}`);
    next();
};

// Middleware to parse JSON and URL-encoded bodies
const parseRequestData = [
    express.json(),
    express.urlencoded({ extended: true })
];

// CORS Middleware
const handleCORS = cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});

// Authentication Middleware (JWT Verification)
const checkAuthHeader = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized access, token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// 404 Handler Middleware
const handle404 = (req, res) => {
    res.status(404).json({
        error: 'Route Not Found',
        message: `The requested URL ${req.originalUrl} was not found on this server`
    });
};

// Error Handling Middleware
const handleError = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal Server Error';

    const errorResponse = {
        error: 'Something went wrong!',
        message: errorMessage
    };

    // Include stack trace in development mode
    if (process.env.NODE_ENV !== 'production') {
        errorResponse.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
};

// Export all middleware
module.exports = {
    logger,
    parseRequestData,
    handleCORS,
    checkAuthHeader,
    handle404,
    handleError
};
