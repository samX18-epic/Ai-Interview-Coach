/**
 * Server Entry Point
 * 
 * Loads environment variables, connects to MongoDB, and starts
 * the Express HTTP server on the configured port.
 */

// Load environment variables from .env file (must be first)
require('dotenv').config({ path: __dirname + '/.env' });

const app = require('./app');
const { connectDB } = require('./config/database');

// Use the PORT from env or fall back to 5000
const PORT = process.env.PORT || 5000;

/**
 * Start the server:
 * 1. Connect to MongoDB
 * 2. Begin listening for HTTP requests
 */
const startServer = async () => {
    try {
        // Establish database connection before accepting requests
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};
// Kick off the server
startServer();