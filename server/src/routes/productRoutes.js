const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    verifyProduct
} = require('../controllers/productController');
const { protect, admin, seller } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, seller, createProduct);
router.route('/:id').get(getProductById);
router.route('/:id/verify').put(protect, admin, verifyProduct);

module.exports = router;
