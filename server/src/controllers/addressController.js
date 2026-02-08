const Address = require('../models/Address');

// @desc    Get user's address
// @route   GET /api/address
// @access  Private
const getUserAddress = async (req, res) => {
    try {
        const address = await Address.findOne({ user: req.user._id });
        
        if (!address) {
            return res.status(404).json({ message: 'No address found' });
        }
        
        res.json(address);
    } catch (error) {
        console.error('Error fetching address:', error);
        res.status(500).json({ message: 'Error fetching address', error: error.message });
    }
};

// @desc    Create or update user's address
// @route   POST /api/address
// @access  Private
const createOrUpdateAddress = async (req, res) => {
    try {
        const {
            fullName,
            phoneNumber,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country
        } = req.body;

        // Validate required fields
        if (!fullName || !phoneNumber || !addressLine1 || !city || !state || !postalCode) {
            return res.status(400).json({ 
                message: 'Please provide all required fields' 
            });
        }

        // Check if address already exists for this user
        let address = await Address.findOne({ user: req.user._id });

        if (address) {
            // Update existing address
            address.fullName = fullName;
            address.phoneNumber = phoneNumber;
            address.addressLine1 = addressLine1;
            address.addressLine2 = addressLine2 || '';
            address.city = city;
            address.state = state;
            address.postalCode = postalCode;
            address.country = country || 'United States';

            const updatedAddress = await address.save();
            res.json(updatedAddress);
        } else {
            // Create new address
            address = new Address({
                user: req.user._id,
                fullName,
                phoneNumber,
                addressLine1,
                addressLine2: addressLine2 || '',
                city,
                state,
                postalCode,
                country: country || 'United States',
                isDefault: true
            });

            const createdAddress = await address.save();
            res.status(201).json(createdAddress);
        }
    } catch (error) {
        console.error('Error creating/updating address:', error);
        res.status(500).json({ message: 'Error saving address', error: error.message });
    }
};

// @desc    Delete user's address
// @route   DELETE /api/address
// @access  Private
const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOne({ user: req.user._id });

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        await address.deleteOne();
        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Error deleting address', error: error.message });
    }
};

module.exports = {
    getUserAddress,
    createOrUpdateAddress,
    deleteAddress
};
