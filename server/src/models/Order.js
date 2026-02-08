const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        qty: { type: Number, required: true },
        price: Number,
        image: String
    }],
    shippingAddress: {
        firstName: String,
        lastName: String,
        address: String,
        city: String,
        postalCode: String,
        country: String,
        phone: String
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String,
    },
    taxPrice: { type: Number, default: 0.0 },
    shippingPrice: { type: Number, default: 0.0 },
    totalPrice: { type: Number, default: 0.0 },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    // Order Tracking Status
    status: {
        type: String,
        enum: [
            'PLACED',
            'CONFIRMED',
            'PACKED',
            'SHIPPED',
            'OUT_FOR_DELIVERY',
            'DELIVERED',
            'CANCELLED'
        ],
        default: 'PLACED'
    },

    // Detailed Timeline
    timeline: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        description: String
    }],

    // Delivery Info
    deliveryPartner: String,
    trackingID: String,

    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
