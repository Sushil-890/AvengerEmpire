const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true // One address per user
    },
    fullName: { 
        type: String, 
        required: true 
    },
    phoneNumber: { 
        type: String, 
        required: true 
    },
    addressLine1: { 
        type: String, 
        required: true 
    },
    addressLine2: { 
        type: String 
    },
    city: { 
        type: String, 
        required: true 
    },
    state: { 
        type: String, 
        required: true 
    },
    postalCode: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        required: true,
        default: 'United States'
    },
    isDefault: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});

module.exports = mongoose.model('Address', addressSchema);
