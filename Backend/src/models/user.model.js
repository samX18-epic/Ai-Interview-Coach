/**
 * User Model
 * 
 * Defines the Mongoose schema and model for user accounts.
 * Used for authentication (signup/login) and associating
 * resumes with individual users.
 */

const mongoose = require('mongoose');

/**
 * User Schema Definition
 * - name: Full name of the user
 * - email: Unique email address used for login
 * - password: Hashed password (plain text should never be stored)
 * - createdAt/updatedAt: Auto-managed timestamp fields
 */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Exclude password from query results by default
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Create and export the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;