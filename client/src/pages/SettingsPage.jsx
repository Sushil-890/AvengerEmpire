import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../Style/SettingsPage.css';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.user);

    if (!userInfo) {
        navigate('/login');
        return null;
    }

    const settingsOptions = [
        {
            icon: '�',
            title: 'Delivery Address',
            subtitle: 'Manage your shipping address',
            path: '/address',
            color: '#CD7F32'
        },
        {
            icon: '�',
            title: 'My Orders',
            subtitle: 'Track and manage your orders',
            path: '/orders',
            color: '#8B0000'
        },
        {
            icon: '�',
            title: 'Notifications',
            subtitle: 'Manage notification preferences',
            path: '#',
            color: '#C0C0C0',
            comingSoon: true
        },
        {
            icon: '�',
            title: 'Privacy & Security',
            subtitle: 'Password and security settings',
            path: '#',
            color: '#9CA3AF',
            comingSoon: true
        },
    ];

    return (
        <div className="settings-page">
            <div className="settings-container">
                {/* Header */}
                <div className="settings-header">
                    <h1>Imperial Settings</h1>
                    <p>Manage your account and preferences</p>
                </div>

                {/* User Info Card */}
                <div className="user-info-card">
                    <div className="user-avatar">
                        <span className="avatar-icon">👤</span>
                    </div>
                    <div className="user-details">
                        <h2>{userInfo.name}</h2>
                        <p className="user-email">{userInfo.email}</p>
                        <span className="user-role-badge">
                            {userInfo.role?.toUpperCase()} RANK
                        </span>
                    </div>
                </div>

                {/* Settings Options */}
                <div className="settings-options">
                    {settingsOptions.map((option, index) => (
                        <div
                            key={index}
                            className={`settings-option ${option.comingSoon ? 'disabled' : ''}`}
                            onClick={() => !option.comingSoon && navigate(option.path)}
                            style={{ borderLeftColor: option.color }}>
                            <div className="option-icon" style={{ backgroundColor: option.color + '20' }}>
                                <span style={{ color: option.color }}>{option.icon}</span>
                            </div>
                            <div className="option-content">
                                <h3>{option.title}</h3>
                                <p>{option.subtitle}</p>
                                {option.comingSoon && <span className="coming-soon-badge">Coming Soon</span>}
                            </div>
                            {!option.comingSoon && <span className="option-arrow">→</span>}
                        </div>
                    ))}
                </div>

                {/* App Info */}
                <div className="app-info">
                    <p>Avenger Empire</p>
                    <p className="version">Version 1.0.0</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
