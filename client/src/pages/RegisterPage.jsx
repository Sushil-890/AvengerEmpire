import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { register } from '../redux/slices/userSlice';
import '../Style/LoginPage.css'; // Reuse Login CSS for consistency

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user'); // Default to buyer
    const [shopName, setShopName] = useState('');
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = location.search ? location.search.split('=')[1] : '/';

    const userRegister = useSelector((state) => state.user);
    const { loading, error, userInfo } = userRegister;

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            // Include role and shopName in registration
            dispatch(register({ name, email, password, role, sellerProfile: role === 'seller' ? { shopName } : {} }));
        }
    };

    return (
        <div className="login-container animate-fade-in">
            <div className="login-form">
                <h1>Sign Up</h1>
                {message && <div className="error-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}
                {loading && <div className="loading">Loading...</div>}
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>I want to:</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="user">Buy Artifacts</option>
                            <option value="seller">Sell Artifacts</option>
                        </select>
                    </div>

                    {role === 'seller' && (
                        <div className="form-group animate-fade-in">
                            <label>Shop Name</label>
                            <input
                                type="text"
                                placeholder="Enter your shop name"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-block">
                        Register
                    </button>
                </form>
                <div className="register-link">
                    Have an Account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
