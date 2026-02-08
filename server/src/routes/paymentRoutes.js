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

    try {
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Payment is legit, update the order
            const order = await Order.findById(orderId);
            if (order) {
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
                res.json({ 
                    message: "Payment Verified", 
                    success: true
                });
            } else {
                res.status(404);
                throw new Error('Order not found regarding this payment');
            }
        } else {
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
                .loading {
                    display: none;
                    color: #666;
                    margin-top: 20px;
                }
                .success {
                    display: none;
                    color: #059669;
                    margin-top: 20px;
                }
                .error {
                    display: none;
                    color: #dc2626;
                    margin-top: 20px;
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

                <button class="pay-button" onclick="startPayment()">
                    Pay ₹${order.totalPrice}
                </button>
                
                <div class="loading" id="loading">Processing payment...</div>
                <div class="success" id="success">Payment successful! Redirecting...</div>
                <div class="error" id="error">Payment failed. Please try again.</div>
            </div>

            <script>
                function startPayment() {
                    document.querySelector('.pay-button').style.display = 'none';
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
                                    orderId: "${order._id}"
                                })
                            }).then(res => res.json()).then(data => {
                                if (data.success) {
                                    // Redirect back to mobile app
                                    setTimeout(() => {
                                        window.location.href = 'exp://192.168.1.27:8081/--/orders/${order._id}?payment=success';
                                    }, 2000);
                                }
                            }).catch(err => {
                                console.error('Verification error:', err);
                                document.getElementById('success').style.display = 'none';
                                document.getElementById('error').style.display = 'block';
                                document.querySelector('.pay-button').style.display = 'block';
                            });
                        },
                        "modal": {
                            "ondismiss": function() {
                                document.getElementById('loading').style.display = 'none';
                                document.querySelector('.pay-button').style.display = 'block';
                            }
                        },
                        "theme": {
                            "color": "#dc2626"
                        }
                    };
                    
                    var rzp = new Razorpay(options);
                    rzp.open();
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