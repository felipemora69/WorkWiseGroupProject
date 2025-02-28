const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        next(); //next middleware
    } else {
        res.status(401).json({ error: 'Unauthorized' }); // not authenticated
    }
};

module.exports = isAuthenticated;