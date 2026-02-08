# Avenger Empire - Premium Marketplace

A full-stack MERN eCommerce platform for buying and selling premium products with advanced seller and admin features.

🌐 **Live Demo**: [https://avengerempires.onrender.com](https://avengerempires.onrender.com)

## Features

### For Customers
- Browse and search products with advanced filtering
- Shopping cart with persistent storage
- Secure checkout and order tracking
- Real-time order status updates with visual timeline
- User profile and order history
- Multiple delivery address management

### For Sellers
- Seller dashboard with sales analytics
- Product management (add, edit, delete)
- Order management and fulfillment
- Image upload for products
- 10-Point Quality Verification system

### For Admins
- Admin dashboard with platform overview
- Product verification and approval
- Order status management
- User role management
- Platform-wide analytics

## Tech Stack

**Frontend**
- React 18 with Vite
- Redux Toolkit for state management
- Axios for API calls
- CSS Modules for styling
- React Router for navigation

**Backend**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- BCrypt password hashing
- Multer for file uploads

**Deployment**
- Frontend: Render (Static Site)
- Backend: Render (Web Service)
- Database: MongoDB Atlas

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd avenger-empire
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

4. Configure environment variables

**Server** (`server/.env`):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000
```

### Running Locally

1. Start MongoDB (if running locally)
```bash
mongod
```

2. Seed database (optional)
```bash
cd server
npm run data:import
```

3. Start backend server
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

4. Start frontend
```bash
cd client
npm run dev
```
Client runs on `http://localhost:5173`

## Production Deployment

### Backend (Render)
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI=<your-mongodb-atlas-uri>`
   - `JWT_SECRET=<your-secret>`
   - `FRONTEND_URL=<your-frontend-url>`

### Frontend (Render)
1. Create new Static Site on Render
2. Connect your GitHub repository
3. Set build command: `cd client && npm install && npm run build`
4. Set publish directory: `client/dist`
5. Add environment variable:
   - `VITE_API_URL=<your-backend-url>`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Seller)
- `PUT /api/products/:id` - Update product (Seller)
- `DELETE /api/products/:id` - Delete product (Seller)
- `PUT /api/products/:id/verify` - Verify product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (Admin/Seller)

### Upload
- `POST /api/upload` - Upload product image

### Address
- `GET /api/address` - Get user addresses
- `POST /api/address` - Add new address
- `PUT /api/address/:id` - Update address
- `DELETE /api/address/:id` - Delete address

## User Roles

- **Customer**: Browse, purchase, and track orders
- **Seller**: Manage products and fulfill orders
- **Admin**: Platform management and verification

## Mobile App

📱 **Coming Soon** - React Native mobile app for iOS and Android

## Security Features

- JWT-based authentication
- Password hashing with BCrypt
- CORS protection
- Input validation and sanitization
- Secure file upload handling
- HTTPS enforced in production

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
