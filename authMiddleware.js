const jwt = require('jsonwebtoken');
const config = require('./config');

const isAuthenticated = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided. Authorization denied.' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, config.secret);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = isAuthenticated;