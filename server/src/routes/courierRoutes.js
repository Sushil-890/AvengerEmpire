const express = require('express');
const router = express.Router();
const { authCourier, createShipment, getShipments, trackShipment, updateShipmentStatus } = require('../controllers/courierController');
const { courierAuth } = require('../middleware/courierAuth');

router.post('/login', authCourier);
router.post('/create-shipment', createShipment); // Public access for internal calls or protect? Let's leave public for simplicity or use courierAuth if simulates separate service.
// For simplicity, create-shipment is open or uses courier token. But Seller calls it. Seller doesn't have Courier Token. 
// So leaving it open for now or we assume Server-Server trust.

router.get('/track/:awb', trackShipment);

// Protected routes
router.get('/shipments', courierAuth, getShipments);
router.put('/status', courierAuth, updateShipmentStatus);

module.exports = router;
