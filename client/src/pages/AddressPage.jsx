import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Style/AddressPage.css';

const AddressPage = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.user);

    const [address, setAddress] = useState({
        fullName: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasAddress, setHasAddress] = useState(false);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }
        fetchAddress();
    }, [userInfo, navigate]);

    const fetchAddress = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/address', config);
            setAddress(data);
            setHasAddress(true);
        } catch (error) {
            if (error.response?.status === 404) {
                // No address found, that's okay
                setHasAddress(false);
            } else {
                console.error('Error fetching address:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!address.fullName || !address.phoneNumber || !address.addressLine1 || 
            !address.city || !address.state || !address.postalCode) {
            alert('Please fill in all required fields');
            return;
        }

        setSaving(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.post('/api/address', address, config);
            alert(hasAddress ? 'Address updated successfully!' : 'Address saved successfully!');
            setHasAddress(true);
            navigate('/settings');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save address');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete your address?')) {
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete('/api/address', config);
            alert('Address deleted successfully');
            navigate('/settings');
        } catch (error) {
            alert('Failed to delete address');
        }
    };

    if (loading) {
        return (
            <div className="address-page">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    return (
        <div className="address-page">
            <div className="address-container">
                <div className="address-header">
                    <h1>{hasAddress ? 'Edit Address' : 'Add Address'}</h1>
                    <p>{hasAddress ? 'Update your delivery address' : 'Add your delivery address'}</p>
                </div>

                <form onSubmit={handleSubmit} className="address-form">
                    <div className="form-row">
                        <div className="form-group full-width">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="fullName"
                                value={address.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group full-width">
                            <label>Phone Number *</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={address.phoneNumber}
                                onChange={handleChange}
                                placeholder="+1 (555) 123-4567"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group full-width">
                            <label>Address Line 1 *</label>
                            <input
                                type="text"
                                name="addressLine1"
                                value={address.addressLine1}
                                onChange={handleChange}
                                placeholder="123 Main Street"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group full-width">
                            <label>Address Line 2 (Optional)</label>
                            <input
                                type="text"
                                name="addressLine2"
                                value={address.addressLine2}
                                onChange={handleChange}
                                placeholder="Apartment, suite, etc."
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>City *</label>
                            <input
                                type="text"
                                name="city"
                                value={address.city}
                                onChange={handleChange}
                                placeholder="New York"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>State *</label>
                            <input
                                type="text"
                                name="state"
                                value={address.state}
                                onChange={handleChange}
                                placeholder="NY"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Postal Code *</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={address.postalCode}
                                onChange={handleChange}
                                placeholder="10001"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Country *</label>
                            <input
                                type="text"
                                name="country"
                                value={address.country}
                                onChange={handleChange}
                                placeholder="United States"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-save" disabled={saving}>
                            {saving ? 'Saving...' : (hasAddress ? 'Update Address' : 'Save Address')}
                        </button>
                        {hasAddress && (
                            <button type="button" className="btn-delete" onClick={handleDelete}>
                                Delete Address
                            </button>
                        )}
                        <button type="button" className="btn-cancel" onClick={() => navigate('/settings')}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressPage;
