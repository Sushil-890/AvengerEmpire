import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart, clearCart } from '../redux/slices/cartSlice';
import { createOrder } from '../redux/slices/orderSlice';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import { getImageUrl } from '../utils/imagePath';
import '../Style/CartPage.css';

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const { userInfo } = useSelector((state) => state.user);
    const orderCreate = useSelector((state) => state.order);
    const { order, success } = orderCreate;

    // useEffect(() => {
    //     if (success) {
    //         navigate(`/orders/${order._id}`);
    //         dispatch(clearCart()); 
    //     }
    // }, [success, navigate, order, dispatch]);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = async () => {
        if (!userInfo) {
            navigate('/login?redirect=cart');
        } else {
            // 1. Create Order in DB first
            const orderData = {
                orderItems: cartItems,
                shippingAddress: { address: '123 Royal Ln', city: 'Empire City', country: 'US' },
                paymentMethod: 'Razorpay',
                itemsPrice: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
                shippingPrice: 10,
                taxPrice: 0,
                totalPrice: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) + 10
            };

            // Dispatch Create Order Action to get OrderI D
            const resultAction = await dispatch(createOrder(orderData));
            if (createOrder.fulfilled.match(resultAction)) {
                const newOrder = resultAction.payload;

                // 2. Create Razorpay Order
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data: { id: razorpayOrderId, amount } } = await axios.post('/api/orders/razorpay', {
                    amount: newOrder.totalPrice
                }, config);

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Using Environment Variable
                    amount: amount,
                    currency: "INR",
                    name: "Avenger Empire",
                    description: "Premium Artifacts",
                    order_id: razorpayOrderId,
                    handler: async function (response) {
                        // 3. Verify Payment
                        const verificationData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: newOrder._id
                        };

                        try {
                            await axios.post('/api/orders/razorpay/verify', verificationData, config);
                            alert('Payment Successful!');
                            dispatch(clearCart());
                            navigate(`/orders/${newOrder._id}`);
                        } catch (error) {
                            alert('Payment Verification Failed');
                        }
                    },
                    prefill: {
                        name: userInfo.name,
                        email: userInfo.email,
                        contact: "9999999999"
                    },
                    theme: {
                        color: "#E03535"
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();

            }
        }
    };

    return (
        <div className="container cart-page animate-fade-in">
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    Your cart is empty. <Link to="/">Go Back</Link>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-list">
                        {cartItems.map((item) => (
                            <div key={item.product} className="cart-item">
                                <img src={getImageUrl(item.image)} alt={item.name} />
                                <div className="item-details">
                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    <span className="price">₹{item.price}</span>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => removeFromCartHandler(item.product)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h3>
                        <p className="total-price">
                            ₹{cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}
                        </p>
                        <button
                            className="btn btn-block"
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
