const express = require('express');
const Item = require('../models/Item');
const ensureAuthenticated = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    const userId = req.user._id;
    const userRole = req.user.role;

    let items;

    if (userRole === 'admin') {
        items = await Item.find({ deletedAt: null }).populate('createdBy', 'username');
    } else {
        items = await Item.find({ createdBy: userId, deletedAt: null });
    }

    res.render('dashboard', { items, userRole });
});

router.get('/stocks', ensureAuthenticated, async (req, res) => {
    res.render('stocks', { AV_API: process.env.AV_API });
});

router.get('/news', ensureAuthenticated, async (req, res) => {
    res.render('news', { NEWS_API: process.env.NEWS_API });
});

module.exports = router;
