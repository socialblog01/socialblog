const pool = require('../config/db');
const cloudinary = require('../config/cloudinary');

// 1. Get Posts (Simplified & Safe)
const getPosts = async (req, res) => {
    try {
        // Simple query first to ensure it works
        const query = `
            SELECT * FROM posts 
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query);
        
        // Manually add empty categories array to keep frontend happy
        const posts = result.rows.map(p => ({
            ...p,
            categories: [] // We can fix categories later, let's just get posts showing first!
        }));

        res.json(posts);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).send('Database Error: ' + err.message);
    }
};

// 2. Upload Image
const uploadImage = async (req, res) => {
    try {
        if (!req.files || !req.files.image) return res.status(400).json({ error: 'No file' });
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, { folder: 'blog' });
        res.json({ imageUrl: result.secure_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
};

// 3. Create Post (Allow missing images)
const createPost = async (req, res) => {
    const { title, content, author, image_url, category_ids } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title/Content required' });

    try {
        const result = await pool.query(
            'INSERT INTO posts (title, content, author, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, content, author || 'Anon', image_url || '']
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// 4. Delete Post
const deletePost = async (req, res) => {
    try {
        await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getPosts, uploadImage, createPost, deletePost };