// server/server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// --- MIDDLEWARE ---
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse Cookies (for JWT)
app.use(express.static('public')); // Serve Frontend
app.use(fileUpload({
    useTempFiles: true,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
}));

// --- ROUTES ---
app.use('/api', authRoutes);           // Routes: /api/register, /api/login, /api/logout
app.use('/api/posts', postRoutes);     // Routes: /api/posts (GET/POST), /api/posts/upload
app.use('/api/categories', categoryRoutes); // Routes: /api/categories

// --- START ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});