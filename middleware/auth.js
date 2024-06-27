const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    // Check if Authorization header exists
    const authHeader = req.header('Authorization');

    if (!authHeader || !(token = authHeader.replace('Bearer ', ''))) {
        return res.status(401).json({ status: 401, message: 'Token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ status: 401, message: 'Token is not valid' });
    }
};
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({status:401, message: 'Not authorized as an admin' });
    }
};
module.exports = { authMiddleware, admin };

//module.exports = authMiddleware;
