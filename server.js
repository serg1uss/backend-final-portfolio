const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

mongoose.connect(process.env.MONGODB_URL).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(authRoutes);
app.use(itemRoutes);
app.use(dashboardRoutes);

app.get('/', (req, res) => {
    const token = req.cookies.authToken;
    if (token) return res.redirect('/dashboard');
    res.render('index');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
