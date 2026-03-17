/**
 * Database Configuration Module
 * 
 * Handles the MongoDB connection lifecycle using Mongoose.
 * Exports a connect function and a getDb helper for retrieving
 * the active database instance.
 */

const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using the URI from environment variables.
 * Logs success or failure to the console.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Exit with failure if DB connection fails
    }
};

/**
 * Returns the current Mongoose connection's underlying native database instance.
 * This allows running raw MongoDB commands (e.g., ping) outside of Mongoose models.
 * @returns {import('mongodb').Db | null} The native MongoDB Db object, or null if not connected.
 */
const getDb = () => {
    const connection = mongoose.connection;

    // readyState 1 means the connection is open and ready
    if (connection.readyState !== 1) {
        console.warn('Database not connected. Current readyState:', connection.readyState);
        return null;
    }

    // Return the native MongoDB driver's Db instance
    return connection.db;
};

module.exports = { connectDB, getDb };