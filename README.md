# Avenger Empire - Premium Marketplace

A full-stack MERN eCommerce application for buying and selling legendary artifacts and premium gear worthy of Earth's Mightiest Heroes.

## Features

- **S.H.I.E.L.D. Secure Marketplace**: Browsing, searching, and filtering of premium artifacts.
- **Stark Tech Verification**: 10-Point Quality Check system with "Verified" badges.
- **Heimdall's Sight Tracking**: Real-time status updates with a visual timeline.
- **Avengers Command Center**: Panel to verify products and update order statuses.
- **User Roles**: Admin, Seller, and Customer roles.

## Tech Stack

- **Frontend**: React (Vite), Redux Toolkit, CSS Modules (Vanilla), Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT & BCrypt.

## Setup Instructions

### Prerequisites
- Node.js installed.
- MongoDB running locally on port 27017.

### Installation

1. **Clone/Navigate** to the project directory.
2. **Install Details**:
   ```bash
   # Server
   cd server
   npm install
   
   # Client
   cd ../client
   npm install
   ```

### Running the App

1. **Seed Data** (Optional, for initial content):
   ```bash
   cd server
   npm run data:import
   ```

2. **Start Server**:
   ```bash
   cd server
   npm run dev
   ```
   Server runs on `http://localhost:5000`.

3. **Start Client**:
   ```bash
   cd client
   npm run dev
   ```
   Client runs on `http://localhost:5173`.


## API Endpoints

- `GET /api/products`: List products
- `POST /api/orders`: Create order
- `PUT /api/orders/:id/status`: Update status (Admin)
- `PUT /api/products/:id/verify`: Verify product (Admin)
