import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaBox, FaSignOutAlt, FaCog } from 'react-icons/fa';
import '../Style/ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [navigate, userInfo]);

    if (!userInfo) return null;

    return (
        <div className="container profile-page animate-fade-in">
            <div className="profile-wrapper">
                <aside className="profile-sidebar">
                    <div className="profile-header-alt">
                        <div className="avatar-large">
                            {userInfo.name.charAt(0).toUpperCase()}
                        </div>
                        <h3>{userInfo.name}</h3>
                        <p>{userInfo.email}</p>
                    </div>

                    <nav className="profile-nav">
                        <Link to="/profile" className="active"><FaUser /> My Profile</Link>
                        <Link to="/orders"><FaBox /> My Orders</Link>
                        <Link to="/settings"><FaCog /> Settings</Link>
                        <button className="logout-btn"><FaSignOutAlt /> Logout</button>
                    </nav>
                </aside>

                <main className="profile-content">
                    <section className="profile-section">
                        <h2>Personal Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Full Name</label>
                                <p>{userInfo.name}</p>
                            </div>
                            <div className="info-item">
                                <label>Email Address</label>
                                <p>{userInfo.email}</p>
                            </div>
                            <div className="info-item">
                                <label>Account Type</label>
                                <p className="account-badge">{userInfo.role}</p>
                            </div>
                            <div className="info-item">
                                <label>Member Since</label>
                                <p>January 2026</p>
                            </div>
                        </div>
                        <button className="btn btn-outline" style={{ marginTop: '20px' }}>Edit Profile</button>
                    </section>

                    <section className="profile-section">
                        <h2>Quick Actions</h2>
                        <div className="quick-actions-grid">
                            <Link to="/orders" className="action-card">
                                <FaBox size={24} />
                                <div>
                                    <h4>View Orders</h4>
                                    <p>Check status of your purchases</p>
                                </div>
                            </Link>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;
