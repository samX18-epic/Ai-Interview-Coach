/**
 * Express Application Setup
 * 
 * Configures the Express app instance with middleware and route mounting.
 * This file is imported by server.js to start listening on a port.
 */

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.set('trust proxy', 1);

// ─── CORS ─────────────────────────────────────────────────────────────────────

// Allow requests from any origin (origin is reflected dynamically); credentials: true lets cookies through
app.use(cors({
    origin: true,
    credentials: true
}));

// ─── Built-in Middleware ───────────────────────────────────────────────────────

// Parse incoming JSON request bodies
app.use(express.json());

// Parse cookies attached to client requests
app.use(cookieParser());

// Parse URL-encoded form data (extended: true allows rich objects/arrays)
app.use(express.urlencoded({ extended: true }));

// ─── Route Mounting ────────────────────────────────────────────────────────────

// Auth routes – handles login, signup, and connectivity checks
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);
// ─── Root Health Check ─────────────────────────────────────────────────────────

const interviewRoutes = require('./routes/interview.routes');
app.use('/api/interview', interviewRoutes);
/**
 * @route   GET /
 * @desc    Simple root endpoint to confirm the API server is running
 * @access  Public
 */
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'ResumeOS API is running',
    });
});

module.exports = app;