// server/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { getAllCategories } = require('../controllers/categoryController');

// Public route to fetch all categories
router.get('/', getAllCategories);

module.exports = router;