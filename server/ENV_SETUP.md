# Environment Variables Setup Guide

This document explains all environment variables used in the backend server.

## Required Environment Variables

### Server Configuration

```env
NODE_ENV=development
```
- **Description**: Application environment
- **Values**: `development`, `production`, `test`
- **Default**: `development`
- **Production**: Set to `production` for production deployments

```env
PORT=5000
```
- **Description**: Port number for the server
- **Default**: `5000`
- **Production**: Use the port provided by your hosting service (e.g., `process.env.PORT`)

### Database

```env
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
```
- **Description**: MongoDB connection string
- **Development**: Local MongoDB instance
- **Production**: Use MongoDB Atlas or your cloud database URL
  - Example: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

### Authentication

```env
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
```
- **Description**: Secret key for JWT token generation
- **Security**: Must be at least 32 characters long
- **Production**: Use a strong, randomly generated secret
  - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Frontend URLs

```env
FRONTEND_URL=http://localhost:5173
```
- **Description**: Web frontend URL (used for CORS)
- **Development**: Local Vite dev server URL
- **Production**: Your deployed web app URL (e.g., `https://yourdomain.com`)

```env
WEB_APP_URL=http://localhost:5173
```
- **Description**: Web app URL for payment redirects
- **Development**: Same as FRONTEND_URL
- **Production**: Your deployed web app URL

### Mobile App Configuration

```env
MOBILE_APP_SCHEME=exp://192.168.1.27:8081/--/
```
- **Description**: Deep link scheme for mobile app payment redirects
- **Development**: 
  - Expo Go: `exp://YOUR_LOCAL_IP:8081/--/`
  - Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- **Production**: 
  - Custom scheme: `avengerempire://` (requires app.json configuration)
  - Universal link: `https://yourdomain.com/` (requires proper setup)

**Important**: Update this with your actual local IP address for development!

### Payment Gateway (Razorpay)

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```
- **Description**: Razorpay API Key ID
- **Development**: Test mode key (starts with `rzp_test_`)
- **Production**: Live mode key (starts with `rzp_live_`)
- **Get Keys**: https://dashboard.razorpay.com/app/keys

```env
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```
- **Description**: Razorpay API Secret Key
- **Security**: Keep this secret! Never commit to version control
- **Production**: Use environment variables or secret management service

### Image Upload (Cloudinary)

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
- **Description**: Cloudinary credentials for image uploads
- **Get Credentials**: https://cloudinary.com/console
- **Production**: Use the same credentials or separate production account

### Courier Credentials (Temporary)

```env
COURIER_EMAIL=courier@example.com
COURIER_PASSWORD=secure_password_here
```
- **Description**: Hardcoded courier login credentials
- **Note**: This is temporary! In production, move to database with proper authentication
- **TODO**: Implement proper courier user management

## Setup Instructions

### Development Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your local values:
   - Get your local IP address for `MOBILE_APP_SCHEME`
   - Add your Razorpay test keys
   - Add your Cloudinary credentials
   - Update MongoDB URI if using a different database

3. Never commit `.env` to version control (already in `.gitignore`)

### Production Setup

1. Set environment variables in your hosting platform:
   - **Heroku**: `heroku config:set VARIABLE_NAME=value`
   - **Vercel**: Add in Project Settings → Environment Variables
   - **AWS/Azure**: Use their respective secret management services
   - **Docker**: Use docker-compose.yml or Kubernetes secrets

2. Update these values for production:
   ```env
   NODE_ENV=production
   MONGO_URI=<your-production-mongodb-url>
   JWT_SECRET=<strong-random-secret>
   FRONTEND_URL=<your-production-web-url>
   WEB_APP_URL=<your-production-web-url>
   MOBILE_APP_SCHEME=<your-app-scheme>://
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=<your-live-secret>
   ```

3. Security checklist:
   - ✅ Use strong JWT secret (32+ characters)
   - ✅ Use live Razorpay keys for production
   - ✅ Enable HTTPS for all URLs
   - ✅ Use MongoDB Atlas with IP whitelist
   - ✅ Never expose secrets in client-side code
   - ✅ Use environment-specific configurations

## Payment Flow Configuration

### For Web App
- Payment is handled directly via Razorpay SDK in the frontend
- Backend verifies payment via `/api/orders/razorpay/verify`
- No redirect needed (stays on same page)

### For Mobile App
- Payment opens in browser via `/api/payment/:orderId?client=mobile`
- After payment, redirects back to app using `MOBILE_APP_SCHEME`
- App checks payment status via `/api/orders/:orderId`

## Troubleshooting

### Mobile App Not Redirecting After Payment
- Check `MOBILE_APP_SCHEME` matches your app configuration
- Verify your local IP address is correct
- For production, ensure deep linking is properly configured in app.json

### CORS Errors
- Ensure `FRONTEND_URL` matches your web app URL exactly
- Check if URL includes protocol (http:// or https://)

### Payment Verification Fails
- Verify Razorpay keys are correct
- Check if using test keys in development
- Ensure webhook signature verification is working

### Database Connection Issues
- Check MongoDB URI format
- Verify database is running (local) or accessible (cloud)
- Check IP whitelist for MongoDB Atlas

## Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Expo Deep Linking](https://docs.expo.dev/guides/linking/)
