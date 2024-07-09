const jwt = require('jsonwebtoken');
const httpStatusCode = require('../constant/httpStatuscode');
const dotenv = require("dotenv");
dotenv.config();

async function getToken(user) {
    const token = jwt.sign({ user: user }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
}

async function verifyToken(req, res, next) {
    const token = req.headers.authorization 
    // && req.headers.authorization.split(' ')[1];
    console.log(token);

    if (!token) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({ success: false, message: 'Unauthorized: Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(httpStatusCode.UNAUTHORIZED).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
}

async function verifyAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(httpStatusCode.FORBIDDEN).json({
            success: false,
            message: 'Forbidden: You do not have the necessary permissions'
        });
    }
    next();
}

module.exports = {
    getToken,
    verifyToken, 
    verifyAdmin,
};
