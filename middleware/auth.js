const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const ensureAuthenticated = async (req, res, next) => {

    const token = req.cookies.authToken;
    if (!token) return res.redirect('/login');

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.redirect('/login');
        const user = await User.findById(decoded.userId);
        if (user) {
            req.user = user; // Attach user object to request
            return next();
        }
    });

};

module.exports = ensureAuthenticated;
