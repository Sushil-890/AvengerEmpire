const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const validateEnv = require('./src/utils/validateEnv');

dotenv.config();

// Validate environment variables before starting server
validateEnv();

connectDB();

const app = express();

// CORS configuration for separate frontend/backend deployments
const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // In development, allow any localhost or local IP requests for testing
        if (process.env.NODE_ENV === 'development') {
            if (origin.includes('localhost') || origin.includes('192.168.') || origin.includes('127.0.0.1')) {
                return callback(null, true);
            }
        }
        
        // Check if origin is in allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // In development, log rejected origins for debugging
            if (process.env.NODE_ENV !== 'production') {
                console.warn(`⚠️  CORS: Rejected origin: ${origin}`);
                console.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`);
            }
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Test endpoint without DB
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is responding', timestamp: new Date() });
});

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
// const uploadRoutes = require('./src/routes/uploadRoutes');
const uploadRoutes = require('./src/routes/uploadRoutesCloudinary');

const courierRoutes = require('./src/routes/courierRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const addressRoutes = require('./src/routes/addressRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/courier', courierRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/address', addressRoutes);

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
