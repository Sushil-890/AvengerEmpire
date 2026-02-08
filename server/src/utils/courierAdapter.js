const CourierShipment = require('../models/CourierShipment');

// Adapter for Courier Service
// Switch this implementation when moving to real Shiprocket/Delhivery API
const createShipment = async (order) => {
    // FAKE COURIER IMPLEMENTATION

    // Generate Fake AWB
    const awb = 'IMP-' + Math.floor(10000000 + Math.random() * 90000000);

    // Simulate API Call latency
    // await new Promise(r => setTimeout(r, 500));

    // Create Shipment in "Remote" System (Local DB in this case)
    await CourierShipment.create({
        awb,
        orderId: order._id,
        status: 'SHIPPED',
        history: [{ status: 'SHIPPED', location: 'Warehouse', timestamp: Date.now() }]
    });

    return {
        trackingID: awb,
        deliveryPartner: 'Imperial Express'
    };
};

module.exports = { createShipment };
