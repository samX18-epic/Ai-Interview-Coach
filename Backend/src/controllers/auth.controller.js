const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');

const registerUserController = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'All fields are required'
        });
    }
    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
        return res.status(400).json({
            status: 'error',
            message: 'User already exist'
        });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({ name: username, email, password: hash });
    return res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: user
    });
};

const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(404).json({
            status: 'error',
            message: 'User not found'
        });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid password'
        });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000  // 24 hours — matches JWT expiry
    });
    res.status(200).json({
        status: 'success',
        message: 'User logged in successfully',
        user: {
            id: user._id,
            email: user.email,
            username: user.name
        }
    });
};

async function logoutUserController(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized'
        });
    }
    await tokenBlacklistModel.create({ token });
    res.clearCookie("token");
    res.status(200).json({
        status: 'success',
        message: 'User logged out successfully'
    });
}


async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);
    res.status(200).json({
        status: 'success',
        message: 'User fetched successfully',
        user
    });
}
module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};