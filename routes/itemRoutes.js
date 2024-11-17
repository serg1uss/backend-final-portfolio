const express = require('express');
const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');
const ensureAuthenticated = require('../middleware/auth');
const router = express.Router();
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({ storage });

router.post('/items/create', ensureAuthenticated, upload.array('images', 3), async (req, res) => {
    if (req.user.role === 'editor' || req.user.role === 'admin') {
        const images = req.files.map(file => `/uploads/${file.filename}`);

        const newItem = new Item({
            title: req.body.title,
            description: req.body.description,
            images,
            createdBy: req.user._id,
        });

        await newItem.save();
        res.redirect('/dashboard');
    } else {
        res.status(403).send('Permission denied');
    }
});

router.post('/items/:id/update', async (req, res) => {
    if (req.user.role === 'admin') {
        const { id } = req.params;
        const { title, description } = req.body;

        await Item.findByIdAndUpdate(id, { title, description });
        res.redirect('/dashboard');
    } else {
        res.status(403).send('Permission denied');
    }
});

router.post('/items/:id/delete', async (req, res) => {
    if (req.user.role === 'admin') {
        const { id } = req.params;

        await Item.findByIdAndUpdate(id, { deletedAt: new Date() });
        res.redirect('/dashboard');
    } else {
        res.status(403).send('Permission denied');
    }
});

module.exports = router;
