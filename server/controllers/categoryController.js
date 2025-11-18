// server/controllers/categoryController.js
const pool = require('../config/db');

const getAllCategories = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name FROM categories ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Failed to fetch categories.' });
    }
};

module.exports = { getAllCategories };