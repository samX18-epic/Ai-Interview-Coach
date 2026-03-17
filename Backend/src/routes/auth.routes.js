const express = require('express');
const authrouter = express.Router();
const authController = require('../controllers/auth.controller');
const { authUser } = require('../middlewares/auth.middleware');

authrouter.post('/register', authController.registerUserController);
authrouter.post('/login', authController.loginUserController);
authrouter.get('/logout', authController.logoutUserController);
authrouter.get('/get-me', authUser, authController.getMeController);

module.exports = authrouter;