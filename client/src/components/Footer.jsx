import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaYoutube,
    FaChevronRight,
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaCcVisa,
    FaCcMastercard,
    FaCcPaypal,
    FaCcApplePay
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-container">
                    <div className="footer-brand">
                        <h2 className="brand">AVENGER <span className="accent">EMPIRE</span></h2>
                        <p>Discover the finest collection of premium artifacts and limited edition apparel. Your gateway to royal style and exclusive artifacts.</p>
                        <div className="social-links">
                            <a href="#" className="social-icon"><FaFacebookF /></a>
                            <a href="#" className="social-icon"><FaTwitter /></a>
                            <a href="#" className="social-icon"><FaInstagram /></a>
                            <a href="#" className="social-icon"><FaYoutube /></a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Shop Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/shop"><FaChevronRight /> Shop All</Link></li>
                            <li><Link to="/search/sneakers"><FaChevronRight /> Sneakers</Link></li>
                            <li><Link to="/search/watches"><FaChevronRight /> Timepieces</Link></li>
                            <li><Link to="/search/jewelry"><FaChevronRight /> Jewelry</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Account</h4>
                        <ul className="footer-links">
                            <li><Link to="/profile"><FaChevronRight /> My Profile</Link></li>
                            <li><Link to="/orders"><FaChevronRight /> Order History</Link></li>
                            <li><Link to="/seller/dashboard"><FaChevronRight /> Seller Portal</Link></li>
                            <li><Link to="/courier/login"><FaChevronRight /> Courier Login</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Contact Us</h4>
                        <ul className="footer-links">
                            <li><a href="mailto:kumrsushil890@gmail.com"><FaEnvelope /> kumrsushil890@gmail.com</a></li>
                            <li><a href="tel:+919198788"><FaPhoneAlt /> +91 9198788XXXX</a></li>
                            <li><a><FaMapMarkerAlt /> 234, Mandi Gobindgarh, 147301</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} AVENGER EMPIRE. All Rights Reserved.</p>
                    <div className="payment-methods">
                        <FaCcVisa />
                        <FaCcMastercard />
                        <FaCcPaypal />
                        <FaCcApplePay />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
