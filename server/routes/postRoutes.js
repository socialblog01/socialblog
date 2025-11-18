const express = require('express');
const router = express.Router();
const { getPosts, uploadImage, createPost, deletePost } = require('../controllers/postController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Public Route
router.get('/', getPosts);

// Protected Routes
router.post('/upload', isAuthenticated, uploadImage);
router.post('/', isAuthenticated, createPost);
router.delete('/:id', isAuthenticated, deletePost);

module.exports = router;