import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOrderDetails } from '../redux/slices/orderSlice';
import { FaCheck, FaTruck, FaBoxOpen } from 'react-icons/fa';
import { getImageUrl } from '../utils/imagePath';
import '../Style/OrderPage.css';

const OrderPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const orderDetails = useSelector((state) => state.order);
    const { order, loading, error } = orderDetails;

    useEffect(() => {
        dispatch(getOrderDetails(id));
    }, [dispatch, id]);

    if (loading) return <div className="container">Loading...</div>;
    if (error) return <div className="container">{error}</div>;
    if (!order) return null;

    return (
        <div className="container order-page animate-fade-in">
            <h1 className="page-title">Order Tracking</h1>
            <p className="order-id">Order ID: #{order._id}</p>

            <div className="order-layout">
                <div className="order-summary">
                    <h3>Items</h3>
                    {order.orderItems.map((item, index) => (
                        <div key={index} className="order-item">
                            <img src={getImageUrl(item.image)} alt={item.name} />
                            <div>
                                <h4>{item.name}</h4>
                                <p>${item.price}</p>
                            </div>
                        </div>
                    ))}

                    <div className="order-totals">
                        <div className="row">
                            <span>Shipping</span>
                            <span>${order.shippingPrice}</span>
                        </div>
                        <div className="row total">
                            <span>Total</span>
                            <span>${order.totalPrice}</span>
                        </div>
                    </div>
                </div>

                <div className="tracking-timeline">
                    <h3>Tracking Status</h3>

                    {/* Visual Progress Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
                        {['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((step, idx) => {
                            const steps = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
                            const currentIdx = steps.indexOf(order.status);
                            const isCompleted = steps.indexOf(step) <= currentIdx;
                            const isCurrent = step === order.status;

                            return (
                                <div key={step} style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
                                    <div style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        background: isCompleted ? '#2ecc71' : '#ddd',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 10px',
                                        border: isCurrent ? '3px solid #b2bec3' : 'none'
                                    }}>
                                        {isCompleted ? <FaCheck size={12} /> : <small>{idx + 1}</small>}
                                    </div>
                                    <span style={{
                                        fontSize: '10px',
                                        color: isCompleted ? '#2d3436' : '#b2bec3',
                                        fontWeight: isCompleted ? 'bold' : 'normal'
                                    }}>
                                        {step.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            );
                        })}
                        {/* Progress Line Background */}
                        <div style={{
                            position: 'absolute',
                            top: '15px',
                            left: '5%',
                            right: '5%',
                            height: '2px',
                            background: '#eee',
                            zIndex: 0
                        }}></div>
                    </div>

                    <h3>Detailed History</h3>
                    <div className="timeline">
                        {order.timeline && order.timeline.map((event, index) => (
                            <div key={index} className={`timeline-item ${index === order.timeline.length - 1 ? 'active' : ''}`}>
                                <div className="timeline-icon">
                                    <FaCheck />
                                </div>
                                <div className="timeline-content">
                                    <h4>{event.status}</h4>
                                    <span className="timestamp">{new Date(event.timestamp).toLocaleString()}</span>
                                    <p>{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
