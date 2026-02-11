const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
}

// @desc    Verify Razorpay Payment (Public endpoint for browser payments)
// @route   POST /api/payment/verify
// @access  Public
router.post('/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    console.log('🔍 Payment verification request:');
    console.log('  orderId:', orderId);
    console.log('  razorpay_payment_id:', razorpay_payment_id);

    try {
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            console.log('✅ Payment signature verified');
            
            // Payment is legit, update the order
            const order = await Order.findById(orderId);
            if (order) {
                console.log('📋 Order found, updating payment status...');
                
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id: razorpay_payment_id,
                    status: 'paid',
                    update_time: Date.now(),
                };

                // Add 'Order Placed' to timeline upon successful payment
                order.timeline.push({
                    status: 'Order Placed',
                    description: 'Payment successful. Order has been placed.',
                    timestamp: Date.now()
                });

                await order.save();
                console.log('✅ Order payment status updated successfully');
                
                res.json({ 
                    message: "Payment Verified", 
                    success: true
                });
            } else {
                console.error('❌ Order not found:', orderId);
                res.status(404);
                throw new Error('Order not found regarding this payment');
            }
        } else {
            console.error('❌ Invalid payment signature');
            res.status(400);
            throw new Error('Invalid signature');
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ 
            message: error.message || 'Payment verification failed',
            success: false 
        });
    }
});

// @desc    Create payment page
// @route   GET /api/payment/:orderId
// @access  Public (but requires valid order)
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        // Determine redirect URL based on client type (from query param or user agent)
        const clientType = req.query.client || 'web'; // 'web' or 'mobile'
        const mobileScheme = process.env.MOBILE_APP_SCHEME || 'avengerempire://';
        const webUrl = process.env.WEB_APP_URL || 'http://localhost:5173';

        // Debug logging
        console.log('🔍 Payment page variables:');
        console.log('  clientType:', clientType);
        console.log('  mobileScheme:', mobileScheme);
        console.log('  webUrl:', webUrl);
        console.log('  orderId:', req.params.orderId);

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: order.totalPrice * 100, // amount in smallest currency unit
            currency: "INR",
            receipt: `receipt_${order._id}`,
        });

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Payment - Avenger Empire</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .container {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    max-width: 400px;
                    width: 100%;
                    text-align: center;
                }
                .logo {
                    color: #dc2626;
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .subtitle {
                    color: #666;
                    margin-bottom: 30px;
                }
                .order-details {
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 30px;
                    text-align: left;
                }
                .order-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                .order-row:last-child {
                    margin-bottom: 0;
                    font-weight: bold;
                    font-size: 18px;
                    color: #dc2626;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 10px;
                }
                .pay-button {
                    background: #dc2626;
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 12px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                    transition: background 0.3s;
                }
                .pay-button:hover {
                    background: #b91c1c;
                }
                .pay-button:disabled {
                    background: #9ca3af;
                    cursor: not-allowed;
                }
                .loading {
                    display: none;
                    color: #666;
                    margin-top: 20px;
                }
                .success {
                    display: none;
                    color: #059669;
                    margin-top: 20px;
                    font-weight: 600;
                }
                .error {
                    display: none;
                    color: #dc2626;
                    margin-top: 20px;
                }
                .close-button {
                    display: none;
                    background: #059669;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 15px;
                }
                .close-button:hover {
                    background: #047857;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">Avenger Empire</div>
                <div class="subtitle">Complete Your Payment</div>
                
                <div class="order-details">
                    <div class="order-row">
                        <span>Order ID:</span>
                        <span>#${order._id.toString().substring(0, 8)}</span>
                    </div>
                    <div class="order-row">
                        <span>Items:</span>
                        <span>${order.orderItems.length} item(s)</span>
                    </div>
                    <div class="order-row">
                        <span>Total Amount:</span>
                        <span>₹${order.totalPrice}</span>
                    </div>
                </div>

                <button class="pay-button" id="payButton" onclick="startPayment()">
                    Pay ₹${order.totalPrice}
                </button>
                
                <div class="loading" id="loading">Processing payment...</div>
                <div class="success" id="success">
                    Payment successful! 
                    <div id="redirectMessage"></div>
                </div>
                <button class="close-button" id="closeButton" onclick="window.close()">
                    Close Window
                </button>
                <div class="error" id="error">Payment failed. Please try again.</div>
            </div>

            <script>
                const CLIENT_TYPE = '${clientType}';
                const MOBILE_SCHEME = '${mobileScheme}';
                const WEB_URL = '${webUrl}';
                const ORDER_ID = '${order._id}';

                console.log('🔍 Browser JavaScript variables:');
                console.log('  CLIENT_TYPE:', CLIENT_TYPE);
                console.log('  MOBILE_SCHEME:', MOBILE_SCHEME);
                console.log('  WEB_URL:', WEB_URL);
                console.log('  ORDER_ID:', ORDER_ID);

                function startPayment() {
                    const payButton = document.getElementById('payButton');
                    payButton.disabled = true;
                    payButton.style.display = 'none';
                    document.getElementById('loading').style.display = 'block';

                    var options = {
                        "key": "${process.env.RAZORPAY_KEY_ID}",
                        "amount": ${razorpayOrder.amount},
                        "currency": "INR",
                        "name": "Avenger Empire",
                        "description": "Order #${order._id.toString().substring(0, 8)}",
                        "order_id": "${razorpayOrder.id}",
                        "handler": function (response) {
                            // Payment successful
                            document.getElementById('loading').style.display = 'none';
                            document.getElementById('success').style.display = 'block';
                            
                            // Verify payment on server
                            fetch('/api/payment/verify', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    orderId: ORDER_ID
                                })
                            }).then(res => res.json()).then(data => {
                                console.log('💳 Payment verification response:', data);
                                if (data.success) {
                                    console.log('✅ Payment verified successfully');
                                    // Wait a bit longer before redirect to ensure database is updated
                                    setTimeout(() => {
                                        handleSuccessRedirect();
                                    }, 1500); // Increased delay
                                } else {
                                    console.error('❌ Payment verification failed:', data);
                                    document.getElementById('success').style.display = 'none';
                                    document.getElementById('error').style.display = 'block';
                                    payButton.disabled = false;
                                    payButton.style.display = 'block';
                                }
                            }).catch(err => {
                                console.error('Verification error:', err);
                                document.getElementById('success').style.display = 'none';
                                document.getElementById('error').style.display = 'block';
                                payButton.disabled = false;
                                payButton.style.display = 'block';
                            });
                        },
                        "modal": {
                            "ondismiss": function() {
                                document.getElementById('loading').style.display = 'none';
                                payButton.disabled = false;
                                payButton.style.display = 'block';
                            }
                        },
                        "theme": {
                            "color": "#dc2626"
                        }
                    };
                    
                    var rzp = new Razorpay(options);
                    rzp.open();
                }

                function handleSuccessRedirect() {
                    if (CLIENT_TYPE === 'mobile') {
                        // Mobile app redirect - use the correct route structure
                        const mobileUrl = MOBILE_SCHEME + 'orders/' + ORDER_ID + '?payment=success';
                        console.log('Redirecting to:', mobileUrl);
                        document.getElementById('redirectMessage').innerHTML = 
                            'Redirecting to app...<br><small>If not redirected, you can close this window.</small>';
                        
                        setTimeout(() => {
                            try {
                                window.location.href = mobileUrl;
                            } catch (error) {
                                console.error('Redirect failed:', error);
                            }
                            
                            // Show close button after redirect attempt
                            setTimeout(() => {
                                document.getElementById('redirectMessage').innerHTML = 
                                    'You can now close this window and return to the app.';
                                document.getElementById('closeButton').style.display = 'inline-block';
                            }, 2000);
                        }, 1000);
                    } else {
                        // Web redirect
                        document.getElementById('redirectMessage').innerHTML = 'Redirecting to orders page...';
                        setTimeout(() => {
                            window.location.href = WEB_URL + '/orders/' + ORDER_ID;
                        }, 1500);
                    }
                }
            </script>
        </body>
        </html>
        `;

        res.send(html);
    } catch (error) {
        console.error('Payment page error:', error);
        res.status(500).send('Error creating payment page');
    }
});

module.exports = router;