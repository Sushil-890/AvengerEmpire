# Avenger Empire - Backend Server

Production-ready Node.js/Express backend for both web and mobile applications.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your values (see ENV_SETUP.md for details)

3. **Start server:**
   ```bash
   npm run dev
   ```

## Environment Variables

See [ENV_SETUP.md](./ENV_SETUP.md) for complete documentation.

**Required:**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret (32+ chars)
- `RAZORPAY_KEY_ID` - Razorpay API key
- `RAZORPAY_KEY_SECRET` - Razorpay secret key

**Optional but Recommended:**
- `FRONTEND_URL` - Web app URL for CORS
- `WEB_APP_URL` - Web app URL for payment redirects
- `MOBILE_APP_SCHEME` - Mobile deep link scheme (update with your local IP)
- `CLOUDINARY_*` - Cloudinary credentials for image uploads

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run test:env` - Validate environment configuration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (seller)
- `PUT /api/products/:id` - Update product (seller)
- `DELETE /api/products/:id` - Delete product (seller)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid

### Payment
- `GET /api/payment/:orderId?client=mobile` - Payment page (mobile)
- `GET /api/payment/:orderId?client=web` - Payment page (web)
- `POST /api/payment/verify` - Verify payment

### Other
- `POST /api/upload` - Upload image
- `POST /api/courier/login` - Courier login
- `GET /api/address` - Get addresses

## Production Deployment

1. Set `NODE_ENV=production`
2. Use production MongoDB URI
3. Use live Razorpay keys (`rzp_live_*`)
4. Configure all environment variables
5. Enable HTTPS
6. Deploy to your platform (Heroku, Vercel, AWS, etc.)

## Troubleshooting

**Server won't start:**
- Run `npm run test:env` to check configuration
- Verify MongoDB is running
- Check environment variables

**Payment redirect not working:**
- Update `MOBILE_APP_SCHEME` with your local IP
- Verify deep linking in mobile app
- Check backend logs

**CORS errors:**
- Verify `FRONTEND_URL` includes protocol (http:// or https://)
- Check allowed origins in console logs

## Documentation

- [ENV_SETUP.md](./ENV_SETUP.md) - Environment configuration guide

## License

Private - All rights reserved

