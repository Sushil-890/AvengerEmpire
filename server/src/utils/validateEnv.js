/**
 * Environment Variables Validation
 * Validates required environment variables on server startup
 */

const validateEnv = () => {
    const requiredEnvVars = [
        'MONGO_URI',
        'JWT_SECRET',
        'RAZORPAY_KEY_ID',
        'RAZORPAY_KEY_SECRET'
    ];

    const optionalEnvVars = [
        'FRONTEND_URL',
        'WEB_APP_URL',
        'MOBILE_APP_SCHEME',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ];

    const missing = [];
    const warnings = [];

    // Check required variables
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });

    // Check optional but recommended variables
    optionalEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            warnings.push(varName);
        }
    });

    // Validate JWT_SECRET strength
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        warnings.push('JWT_SECRET should be at least 32 characters long for security');
    }

    // Check if using test keys in production
    if (process.env.NODE_ENV === 'production') {
        if (process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_')) {
            warnings.push('Using Razorpay TEST keys in PRODUCTION environment!');
        }
    }

    // Check URL formats
    const urlVars = ['FRONTEND_URL', 'WEB_APP_URL'];
    urlVars.forEach(varName => {
        const value = process.env[varName];
        if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
            warnings.push(`${varName} should start with http:// or https://`);
        }
    });

    // Report results
    if (missing.length > 0) {
        console.error('\n❌ MISSING REQUIRED ENVIRONMENT VARIABLES:');
        missing.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        console.error('\nPlease check your .env file and ENV_SETUP.md for configuration details.\n');
        process.exit(1);
    }

    if (warnings.length > 0) {
        console.warn('\n⚠️  ENVIRONMENT WARNINGS:');
        warnings.forEach(warning => {
            console.warn(`   - ${warning}`);
        });
        console.warn('\nThese are optional but recommended for full functionality.\n');
    }

    // Success message
    console.log('✅ Environment variables validated successfully');
    
    // Log configuration summary (without sensitive data)
    console.log('\n📋 Configuration Summary:');
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Port: ${process.env.PORT || 5000}`);
    console.log(`   Database: ${process.env.MONGO_URI ? '✓ Configured' : '✗ Missing'}`);
    console.log(`   JWT Secret: ${process.env.JWT_SECRET ? '✓ Configured' : '✗ Missing'}`);
    console.log(`   Razorpay: ${process.env.RAZORPAY_KEY_ID ? '✓ Configured' : '✗ Missing'}`);
    console.log(`   Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? '✓ Configured' : '✗ Not configured'}`);
    console.log(`   Frontend URL: ${process.env.FRONTEND_URL || 'Not set (using default)'}`);
    console.log(`   Mobile Scheme: ${process.env.MOBILE_APP_SCHEME || 'Not set (using default)'}`);
    console.log('');
};

module.exports = validateEnv;
