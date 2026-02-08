const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getUserAddress,
    createOrUpdateAddress,
    deleteAddress
} = require('../controllers/addressController');

// All routes are protected (require authentication)
router.route('/')
    .get(protect, getUserAddress)
    .post(protect, createOrUpdateAddress)
    .delete(protect, deleteAddress);

module.exports = router;
