const express = require('express');
const response = require('../helper/respons');
const users = express.Router();
const { registerUser, loginUser } = require('../controllers/users');

// Endpoint for user registration
users.route('/register').post(async (req, res) => {
    try {
        const userData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password: req.body.password,
        };

        console.log('Received Role:', userData.role);

        const result = await registerUser(userData);
        response.success(result, 'User registered successfully!', res);
    } catch (error) {
        response.error({ error: 'Error registering user. ' + error.message }, req.originalUrl, 500, res);
    }
});

// Endpoint for user login
users.route('/login').post(async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        response.success(result, 'User logged in successfully!', res);
    } catch (error) {
        console.error('Error logging in:', error);
        response.error({ error: 'Error logging in. ' + error.message }, req.originalUrl, 500, res);
    }
});

module.exports = users;
