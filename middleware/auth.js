const jwt = require('jsonwebtoken');
const httpStatusCode = require('../constant/httpStatuscode');
const dotenv = require("dotenv");
dotenv.config();

async function getToken(user) {
    const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
}

async function verifyToken(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

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

module.exports = {
    getToken,
    verifyToken
};
