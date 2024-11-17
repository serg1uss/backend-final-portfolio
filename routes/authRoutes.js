const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username, email, password, firstName, lastName, age, gender, twoFA } = req.body;

    if (!username || !password || !firstName || !lastName || !age || !gender) {
        return res.status(400).send('All fields are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            age,
            gender,
            role: 'editor',
            twoFAEnabled: twoFA === 'enabled' ? true : false,
        });
        await user.save();

        const transporter = nodemailer.createTransport({
            host: process.env.SMPT_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMPT_USER,
                pass: process.env.SMPT_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMPT_USER,
            to: email,
            subject: 'Welcome to the App!',
            text: `Hi ${firstName},\n\nWelcome to our application! We're glad to have you.\n\nBest Regards,\nThe Team`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Error registering user');
            }
            console.log('Email sent:', info.response);
            res.redirect('/login');
        });

        if (twoFA === 'enabled') {
            const secret = speakeasy.generateSecret();
            user.twoFASecret = secret.base32;

            qrcode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
                if (err) throw err;
                res.render('twofa-setup', { qrCode: dataUrl, secret: secret.base32, userId: user._id });
            });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Error registering user');
    }
});

router.post('/confirm-2fa', async (req, res) => {
    const { userId, secret } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send('User not found');
        }

        user.twoFASecret = secret;
        await user.save();

        res.redirect('/login');
    } catch (error) {
        console.error('Error confirming 2FA:', error);
        res.status(500).send('Error confirming 2FA');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(400).send('User not found');

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(400).send('Invalid password');

    if (user.twoFAEnabled) {
        res.render('twofa-verify', { userId: user._id });
    } else {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('authToken', token);
        res.redirect('/dashboard');
    }
});

router.post('/verify-2fa', async (req, res) => {
    const { userId, twoFACode } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(400).send('User not found');

    const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: 'base32',
        token: twoFACode,
        window: 2
    });

    if (verified) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('authToken', token);
        res.redirect('/dashboard');
    }
});

module.exports = router;
