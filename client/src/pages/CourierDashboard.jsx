import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../Style/CourierDashboard.css';

const CourierDashboard = () => {
    const [shipments, setShipments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('courierToken');
        if (!token) {
            navigate('/courier/login');
            return;
        }

        fetch('/api/courier/shipments', {
            headers: { Authorization: 'Bearer ' + token }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setShipments(data);
            })
            .catch(err => console.error(err));
    }, [navigate]);

    const updateStatus = async (awb, status) => {
        const token = localStorage.getItem('courierToken');
        const location = prompt("Enter Current Location (e.g. Hub, City, Warehouse)");
        if (!location) return;

        try {
            const res = await fetch('/api/courier/status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                body: JSON.stringify({ awb, status, location })
            });
            if (res.ok) {
                alert('Shipment Updated');
                setShipments(shipments.map(s =>
                    s.awb === awb ? { ...s, status: status } : s
                ));
            } else {
                const err = await res.json();
                alert('Failed: ' + err.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container courier-dashboard animate-fade-in">
            <div className="courier-header">
                <div>
                    <h1>Courier Control Panel</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time shipment tracking and status management.</p>
                </div>
                <button
                    className="btn btn-outline"
                    onClick={() => { localStorage.removeItem('courierToken'); navigate('/courier/login'); }}
                >
                    Logout
                </button>
            </div>

            <div className="table-responsive shipment-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>AWB Number</th>
                            <th>Order Details</th>
                            <th>Destination</th>
                            <th>Status</th>
                            <th>Last Activity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipments.map(s => (
                            <tr key={s._id}>
                                <td className="awb-cell">{s.awb}</td>
                                <td className="order-ref-cell">
                                    <small>REF: #{s.orderId?._id.substring(0, 8)}</small>
                                    <strong>Value: ₹{s.orderId?.totalPrice}</strong>
                                </td>
                                <td>
                                    {s.orderId?.shippingAddress?.city}
                                    <br />
                                    <small style={{ color: 'var(--text-muted)' }}>PIN: {s.orderId?.shippingAddress?.postalCode}</small>
                                </td>
                                <td>
                                    <span className={`status-badge ${s.status === 'DELIVERED' ? 'success' : s.status === 'OUT_FOR_DELIVERY' ? 'info' : 'warning'}`}>
                                        {s.status}
                                    </span>
                                </td>
                                <td style={{ fontSize: '0.85rem' }}>
                                    {new Date(s.updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                </td>
                                <td>
                                    {s.status !== 'DELIVERED' && (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {s.status === 'SHIPPED' && (
                                                <button
                                                    onClick={() => updateStatus(s.awb, 'OUT_FOR_DELIVERY')}
                                                    className="btn btn-sm btn-outline"
                                                    style={{ minWidth: 'auto', fontSize: '0.75rem' }}
                                                >
                                                    Set Out for Delivery
                                                </button>
                                            )}
                                            {s.status === 'OUT_FOR_DELIVERY' && (
                                                <button
                                                    onClick={() => updateStatus(s.awb, 'DELIVERED')}
                                                    className="btn btn-sm"
                                                    style={{ minWidth: 'auto', fontSize: '0.75rem' }}
                                                >
                                                    Confirm Delivery
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {shipments.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No active shipments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourierDashboard;
