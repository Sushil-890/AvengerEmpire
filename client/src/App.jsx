import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderPage from './pages/OrderPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SellerDashboard from './pages/SellerDashboard';
import SettingsPage from './pages/SettingsPage';
import AddressPage from './pages/AddressPage';

import CourierLogin from './pages/CourierLogin';
import CourierDashboard from './pages/CourierDashboard';

import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <Header />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search/:keyword" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/address" element={<AddressPage />} />
          <Route path="/shop" element={<HomePage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/orders/:id" element={<OrderPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />

          {/* Courier Routes */}
          <Route path="/courier/login" element={<CourierLogin />} />
          <Route path="/courier" element={<CourierDashboard />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
