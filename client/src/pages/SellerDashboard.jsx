import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../redux/slices/productSlice';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaMoneyBillWave, FaBox, FaShippingFast, FaCheck } from 'react-icons/fa';
import { getImageUrl } from '../utils/imagePath';
import '../Style/SellerDashboard.css';

const SellerDashboard = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.product);
    const { userInfo } = useSelector((state) => state.user);

    // Tabs: 'inventory', 'orders'
    const [activeTab, setActiveTab] = useState('inventory');

    // Data Stats
    const [myProducts, setMyProducts] = useState([]);
    const [myOrders, setMyOrders] = useState([]);

    // Form Stats
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '', brand: '', model: '', category: 'Home', colorway: '', size: 9, condition: 'New', price: 0,
        description: '', images: '', boxCondition: 'Good'
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (userInfo) {
            // Fetch Inventory
            const fetchSellerProducts = async () => {
                dispatch(listProducts()).then((res) => {
                    if (res.payload && res.payload.products) {
                        const sellerProds = res.payload.products.filter(p => p.seller?._id === userInfo._id || p.seller === userInfo._id);
                        setMyProducts(sellerProds);
                    }
                });
            };
            fetchSellerProducts();

            // Fetch Orders
            fetchSellerOrders();
        }
    }, [dispatch, userInfo]);

    const fetchSellerOrders = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/orders/seller', config);
            setMyOrders(data);
        } catch (error) {
            console.error("Error fetching orders", error);
        }
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);
            const currentImages = newItem.images ? newItem.images.split(',') : [];
            currentImages.push(data);
            setNewItem({ ...newItem, images: currentImages.join(',') });
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('Image upload failed');
        }
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const productData = {
                ...newItem,
                images: newItem.images.split(',').map(i => i.trim()).filter(i => i)
            };
            if (productData.images.length === 0) {
                alert('Please upload at least one image');
                return;
            }
            await axios.post('/api/products', productData, config);
            alert('Product Listed Successfully!');
            setShowForm(false);
            setNewItem({ name: '', brand: '', model: '', category: 'Home', colorway: '', size: 9, condition: 'New', price: 0, description: '', images: '', boxCondition: 'Good' });
            dispatch(listProducts());
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating listing');
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        if (!window.confirm(`Update order status to ${newStatus}?`)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.put(`/api/orders/${orderId}/status`, { status: newStatus }, config);
            alert('Status Updated');
            fetchSellerOrders();
        } catch (error) {
            alert(error.response?.data?.message || 'Update failed');
        }
    };

    const getAvailableActions = (currentStatus) => {
        const flow = {
            'PLACED': ['CONFIRMED', 'CANCELLED'],
            'CONFIRMED': ['PACKED', 'CANCELLED'],
            'PACKED': ['SHIPPED', 'CANCELLED'],
            'SHIPPED': [], // Courier takes over
            'OUT_FOR_DELIVERY': [],
            'DELIVERED': [],
            'CANCELLED': []
        };
        return flow[currentStatus] || [];
    };

    return (
        <div className="container seller-dashboard animate-fade-in">
            <div className="dashboard-header">
                <div>
                    <h1>Seller Dashboard</h1>
                    <p>Manage your inventory and track sales.</p>
                </div>
                <div className="shop-info">
                    <h3>{userInfo.sellerProfile?.shopName || 'My Shop'}</h3>
                    <span>Rating: {userInfo.sellerProfile?.rating || 0}/5</span>
                </div>
            </div>

            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inventory')}
                >
                    Inventory
                </button>
                <button
                    className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders & Fulfillment
                </button>
            </div>

            {activeTab === 'inventory' ? (
                <>
                    <div className="dashboard-actions">
                        <button className="btn" onClick={() => setShowForm(!showForm)}>
                            <FaPlus /> List New Artifact
                        </button>
                    </div>

                    {showForm && (
                        <div className="listing-form-container">
                            <h3>Create New Listing</h3>
                            <form onSubmit={handleCreateProduct} className="listing-form">
                                <div className="form-row">
                                    <input placeholder="Product Name (e.g. Air Jordan 1 Retro High)" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required />
                                </div>
                                <div className="form-row">
                                    <input placeholder="Brand (e.g. Nike)" value={newItem.brand} onChange={e => setNewItem({ ...newItem, brand: e.target.value })} required />
                                    <input placeholder="Model (e.g. Jordan 1)" value={newItem.model} onChange={e => setNewItem({ ...newItem, model: e.target.value })} required />
                                </div>
                                <div className="form-row">
                                    <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                                        <option value="Home">Home</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Sneakers">Sneakers</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Books">Books</option>
                                        <option value="Toys">Toys</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <input placeholder="Colorway" value={newItem.colorway} onChange={e => setNewItem({ ...newItem, colorway: e.target.value })} required />
                                </div>
                                <div className="form-row">
                                    <input type="number" placeholder="Size (US)" value={newItem.size} onChange={e => setNewItem({ ...newItem, size: e.target.value })} required />
                                    <select value={newItem.condition} onChange={e => setNewItem({ ...newItem, condition: e.target.value })}>
                                        <option>New</option>
                                        <option>Used - Like New</option>
                                        <option>Used - Good</option>
                                    </select>
                                </div>
                                <div className="form-row">
                                    <input type="number" placeholder="Price ($)" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} required />
                                </div>
                                <textarea placeholder="Description" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />

                                <div className="form-group">
                                    <label>Product Images</label>
                                    <input
                                        type="text"
                                        placeholder="Image Paths (auto-filled on upload)"
                                        value={newItem.images}
                                        readOnly
                                    />
                                    <input type="file" onChange={uploadFileHandler} />
                                    {uploading && <p className="loader">Uploading...</p>}
                                </div>

                                <button type="submit" className="btn btn-sm">Submit Listing</button>
                            </form>
                        </div>
                    )}

                    <div className="inventory-section">
                        <h2>Your Inventory</h2>
                        <div className="table-responsive">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Verification</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myProducts.map(product => (
                                        <tr key={product._id}>
                                            <td><img src={getImageUrl(product.images[0])} width="50" height="50" style={{ objectFit: 'contain', borderRadius: '4px' }} alt="" /></td>
                                            <td>
                                                <div style={{ fontWeight: '600' }}>{product.model}</div>
                                                <small style={{ color: 'var(--text-muted)' }}>{product.condition}</small>
                                            </td>
                                            <td style={{ fontWeight: '700' }}>${product.price}</td>
                                            <td>
                                                <span className={`status-badge info`}>{product.status}</span>
                                            </td>
                                            <td>
                                                {product.isVerified ? (
                                                    <span className="status-badge success">Verified</span>
                                                ) : (
                                                    <span className="status-badge warning">Pending</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {myProducts.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No products listed yet.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="orders-section">
                    <h2>Incoming Orders</h2>
                    <div className="table-responsive">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Buyer</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myOrders.map(order => (
                                    <tr key={order._id}>
                                        <td style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>#{order._id.substring(0, 10)}</td>
                                        <td style={{ fontWeight: '600' }}>{order.user?.name || 'Customer'}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {getAvailableActions(order.status).map(action => (
                                                    <button
                                                        key={action}
                                                        onClick={() => handleUpdateStatus(order._id, action)}
                                                        className="btn btn-outline"
                                                        style={{ fontSize: '0.75rem', padding: '6px 12px', minWidth: 'auto' }}
                                                    >
                                                        Mark {action}
                                                    </button>
                                                ))}
                                                {getAvailableActions(order.status).length === 0 && (
                                                    <small style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                                                        {order.status === 'SHIPPED' || order.status === 'OUT_FOR_DELIVERY' || order.status === 'DELIVERED' ? 'Courier In Control' : 'Finalized'}
                                                    </small>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {myOrders.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No orders found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerDashboard;
