const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // Product name (e.g., "Air Jordan 1 Retro High")
    brand: { type: String, required: true }, // Nike, Adidas, etc
    model: { type: String, required: true }, // Jordan 1, Yeezy 350
    category: { type: String, required: true, default: 'Home' }, // Home, Electronics, Fashion, Sneakers, etc
    colorway: { type: String, required: true },
    size: { type: Number, required: true },
    condition: { type: String, enum: ['New', 'Used - Like New', 'Used - Good'], required: true },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    description: { type: String },
    boxCondition: { type: String, enum: ['Good', 'Damaged', 'No Box'], default: 'Good' },

    // Authenticity & Admin fields
    isVerified: { type: Boolean, default: false },
    qualityCheck: {
        boxLabel: { type: Boolean, default: false },
        stitching: { type: Boolean, default: false },
        sole: { type: Boolean, default: false },
        logo: { type: Boolean, default: false },
        material: { type: Boolean, default: false },
        scent: { type: Boolean, default: false }, // Yes, smell test is real
        uvLight: { type: Boolean, default: false },
        productionDate: { type: Boolean, default: false },
        accessories: { type: Boolean, default: false },
        overall: { type: Boolean, default: false },
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        verificationDate: Date
    },

    status: { type: String, enum: ['available', 'sold', 'pending_verification'], default: 'available' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
