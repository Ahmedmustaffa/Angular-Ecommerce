const adminGuard = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // They are an admin, allow them to proceed
    } else {
        return res.status(403).json({ message: 'Access Denied. Admin privileges required.' });
    }
};

module.exports = adminGuard;