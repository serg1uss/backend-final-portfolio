const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true }, // Array of image URLs
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deletedAt: { type: Date, default: null }, // Soft delete timestamp
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
