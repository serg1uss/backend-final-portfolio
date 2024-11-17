const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true }, // Add email field
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    role: { type: String, default: 'editor' },
    twoFAEnabled: { type: Boolean, default: false },
    twoFASecret: { type: String },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
