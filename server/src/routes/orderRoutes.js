const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    getMyOrders,
    getSellerOrders,
    createPaymentOrder,
    verifyPayment
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/seller').get(protect, getSellerOrders); // New route
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/status').put(protect, updateOrderStatus); // Removed 'admin' middleware to allow sellers

router.route('/razorpay').post(protect, createPaymentOrder);
router.route('/razorpay/verify').post(protect, verifyPayment);

module.exports = router;
