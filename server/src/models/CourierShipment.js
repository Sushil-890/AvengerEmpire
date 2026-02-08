const mongoose = require('mongoose');

const courierShipmentSchema = new mongoose.Schema({
    awb: { type: String, required: true, unique: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    status: {
        type: String,
        enum: ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'],
        default: 'SHIPPED'
    },
    location: { type: String, default: 'Warehouse' },
    history: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        location: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('CourierShipment', courierShipmentSchema);
