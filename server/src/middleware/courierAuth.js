const courierAuth = (req, res, next) => {
    // Hardcoded credentials as per requirement
    // In real app, this would use JWT or session
    // For now, we expect credentials in body or header for login, 
    // but for protected routes, we might need a simple token or just check a custom header if we want to simulate session.
    // However, for simplicity in this "fake" panel, we will assume the frontend sends a custom header 'x-courier-auth' with the password.

    // Actually, usually middleware checks token. 
    // Let's assume the client sends a token "courier-secret-token" if logged in.

    // Better: Just check if req.user is courier?
    // Since we refer to "Courier Control Panel ... with its own backend APIs",
    // simple Custom Auth Middleware.

    const token = req.headers.authorization;
    if (token && token.startsWith('Bearer COURIER_TOKEN_123')) {
        req.user = { role: 'courier', email: 'Courier@gmail.com' };
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as Courier');
    }
};

module.exports = { courierAuth };
