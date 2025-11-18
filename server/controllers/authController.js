const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2)', [username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') return res.status(409).json({ error: 'Username taken.' });
        res.status(500).json({ error: 'Registration failed.' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Create JWT Token
        const token = jwt.sign(
            { id: user.id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // Send Token in HTTP-Only Cookie (Secure & Easy for Frontend)
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({ message: 'Login successful!', user: { id: user.id, username: user.username } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed.' });
    }
};

const logout = (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: 'Logged out successfully.' });
};

module.exports = { register, login, logout };