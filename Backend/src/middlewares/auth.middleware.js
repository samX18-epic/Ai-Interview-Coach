const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require('../models/blacklist.model');

function authUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        console.log("❌ No token in cookies");
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized: No token provided'
        });
    }

    tokenBlacklistModel.findOne({ token })
        .then(isTokenBlacklisted => {
            if (isTokenBlacklisted) {
                console.log("❌ Token is blacklisted");
                return res.status(401).json({
                    status: 'error',
                    message: 'Unauthorized: Token is blacklisted'
                });
            }
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log("✅ Token verified, user ID:", decoded.id);
                req.user = decoded;
                next();
            } catch (err) {
                console.error("❌ JWT verification failed:", err.message);
                return res.status(401).json({
                    status: 'error',
                    message: 'Unauthorized: Invalid or expired token',
                    reason: err.message
                });
            }
        })
        .catch((err) => {
            console.error("❌ Database error checking token blacklist:", err);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        });
}

module.exports = { authUser };