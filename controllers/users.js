const db = require('../config/connection');
const bcrypt = require('bcrypt');

exports.registerUser = async (data) => {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = {
            name: data.name,
            email: data.email,
            role: data.role,
            password: hashedPassword,
        };

        const query = await db.query('INSERT INTO users SET ?', [newUser]);

        return { id: query.insertId };
    } catch (error) {
        console.error('Error registering user:', error);
        throw new Error('Error registering user. ' + error.message);
    }
};

exports.loginUser = async (email, password) => {
    try {
        const user = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            throw new Error('User not found. Check email.');
        }

        const passwordMatch = await bcrypt.compare(password, user[0].password);

        if (!passwordMatch) {
            throw new Error('Incorrect password.');
        }

        return {
            id: user[0].id,
            username: user[0].username,
            email: user[0].email,
            role: user[0].role,
        };
    } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Error logging in. ' + error.message);
    }
};