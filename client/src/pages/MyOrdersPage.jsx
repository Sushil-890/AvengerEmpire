import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaHistory, FaArrowLeft } from 'react-icons/fa';
import '../Style/MyOrdersPage.css';

const MyOrdersPage = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.user);
    const [myOrders, setMyOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            const fetchMyOrders = async () => {
                setLoadingOrders(true);
                try {
                    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                    const { data } = await axios.get('/api/orders/myorders', config);
                    setMyOrders(data);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                }
                setLoadingOrders(false);
            };
            fetchMyOrders();
        }
    }, [navigate, userInfo]);

    if (!userInfo) return null;

    return (
        <div className="container order-history-page animate-fade-in">
            <div className="section-header-alt">
                <Link to="/profile" className="back-btn"><FaArrowLeft /></Link>
                <h1><FaHistory /> Order History</h1>
            </div>

            {loadingOrders ? (
                <div className="loader">Loading your orders...</div>
            ) : (
                <div className="orders-container">
                    {myOrders.length === 0 ? (
                        <div className="empty-state">
                            <p>You haven't placed any orders yet.</p>
                            <Link to="/shop" className="btn">Start Shopping</Link>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Paid</th>
                                        <th>Delivered</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myOrders.map((order) => (
                                        <tr key={order._id}>
                                            <td className="order-id">#{order._id.substring(0, 10)}</td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="price">₹{order.totalPrice.toFixed(2)}</td>
                                            <td>
                                                <span className={`status-badge ${order.isPaid ? 'success' : 'danger'}`}>
                                                    {order.isPaid ? 'Paid' : 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${order.isDelivered ? 'success' : 'warning'}`}>
                                                    {order.isDelivered ? 'Delivered' : 'In Transit'}
                                                </span>
                                            </td>
                                            <td>
                                                <Link to={`/orders/${order._id}`} className="view-link">View Details</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;
