const CourierShipment = require('../models/CourierShipment');
const Order = require('../models/Order');

// @desc    Auth Courier
// @route   POST /api/courier/login
// @access  Public
const authCourier = (req, res) => {
    const { email, password } = req.body;
    if (email === 'Courier@gmail.com' && password === 'admin@123') {
        res.json({
            email,
            token: 'COURIER_TOKEN_123'
        });
    } else {
        res.status(401);
        throw new Error('Invalid courier credentials');
    }
};

// @desc    Create Shipment (Called by Order Service or Seller)
// @route   POST /api/courier/create-shipment
// @access  Private (Courier Auth or Internal)
const createShipment = async (req, res) => {
    const { orderId } = req.body;

    // Allow re-shipping if AWB exists? No, check unique
    const existing = await CourierShipment.findOne({ orderId });
    if (existing) {
        return res.json(existing);
    }

    // Generate Fake AWB
    const awb = 'IMP-' + Math.floor(10000000 + Math.random() * 90000000);

    const shipment = new CourierShipment({
        awb,
        orderId,
        status: 'SHIPPED',
        history: [{ status: 'SHIPPED', location: 'Central Warehouse' }]
    });

    await shipment.save();

    res.status(201).json(shipment);
};

// @desc    Get all shipments
// @route   GET /api/courier/shipments
// @access  Private (Courier)
const getShipments = async (req, res) => {
    const shipments = await CourierShipment.find().populate('orderId', 'shippingAddress totalPrice _id isPaid itemsPrice');
    res.json(shipments);
};

// @desc    Track shipment by AWB
// @route   GET /api/courier/track/:awb
// @access  Public
const trackShipment = async (req, res) => {
    const { awb } = req.params;
    const shipment = await CourierShipment.findOne({ awb }).populate('orderId');
    if (shipment) {
        res.json(shipment);
    } else {
        res.status(404);
        throw new Error('Shipment not found');
    }
};

// @desc    Update Shipment Status
// @route   PUT /api/courier/status
// @access  Private (Courier)
const updateShipmentStatus = async (req, res) => {
    const { awb, status, location } = req.body;

    // Statuses: OUT_FOR_DELIVERY, DELIVERED

    const shipment = await CourierShipment.findOne({ awb });
    if (!shipment) {
        res.status(404);
        throw new Error('Shipment not found');
    }

    shipment.status = status;
    shipment.history.push({ status, location: location || 'Transit', timestamp: Date.now() });
    await shipment.save();

    // WEBHOOK CALLBACK MOCK
    // Updating Order Service
    const order = await Order.findById(shipment.orderId);
    if (order) {
        order.status = status;
        if (status === 'DELIVERED') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }
        order.timeline.push({ status, description: `Courier Update: ${status} - ${location || 'Transit'}`, timestamp: Date.now() });
        await order.save();
    }

    res.json(shipment);
};

module.exports = { authCourier, createShipment, getShipments, trackShipment, updateShipmentStatus };
