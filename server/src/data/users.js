const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
    },
    {
        name: 'Seller One',
        email: 'seller@example.com',
        password: 'password123',
        role: 'seller',
        sellerProfile: {
            shopName: 'KicksOnFire',
            rating: 4.8,
            reviews: 120
        }
    },
    {
        name: 'John Doe',
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
    },
];

module.exports = users;
