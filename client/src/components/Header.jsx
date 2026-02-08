import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaSun, FaMoon } from 'react-icons/fa';
import { logout } from '../redux/slices/userSlice';
import './Header.css';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userLogin = useSelector((state) => state.user);
    const { userInfo } = userLogin;
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const [keyword, setKeyword] = React.useState('');
    const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    };

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container header-container">
                <Link to="/" className="brand">AVENGER <span className="accent">EMPIRE</span></Link>

                <form onSubmit={submitHandler} className="search-bar">
                    <input
                        type="text"
                        placeholder="Search the empire..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button type="submit"><FaSearch /></button>
                </form>

                <nav className="nav-menu">
                    <Link to="/cart" className="nav-link cart-link">
                        <FaShoppingCart />
                        {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
                    </Link>

                    <button className="nav-link theme-toggle" onClick={toggleTheme}>
                        {theme === 'dark' ? <FaSun /> : <FaMoon />}
                    </button>

                    {userInfo ? (
                        <div className="dropdown">
                            <button className="nav-link user-btn">
                                <FaUser /> {userInfo.name}
                            </button>
                            <div className="dropdown-content">
                                <Link to="/profile">Profile</Link>
                                <Link to="/orders">My Orders</Link>
                                <Link to="/settings">Settings</Link>
                                {userInfo.role === 'admin' && <Link to="/admin/dashboard">Admin Dashboard</Link>}
                                {userInfo.role === 'seller' && <Link to="/seller/dashboard">Seller Dashboard</Link>}
                                <button onClick={logoutHandler}>Logout</button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-link"><FaUser /> Login</Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
