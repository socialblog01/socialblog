const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    // Get token from the 'jwt' cookie
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    try {
        // Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach user data to request
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = { isAuthenticated };