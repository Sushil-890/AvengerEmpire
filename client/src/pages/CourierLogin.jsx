import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../Style/CourierLogin.css';

const CourierLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/courier/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('courierToken', data.token);
                navigate('/courier');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (err) {
            alert('Error logging in');
            console.error(err);
        }
    };

    return (
        <div className="courier-login-container animate-fade-in">
            <div className="courier-login-card">
                <h2>Courier Portal</h2>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="courier@empire.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn login-submit-btn"
                    >
                        Access Control Panel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CourierLogin;
