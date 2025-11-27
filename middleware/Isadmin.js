const isAdmin = (req, res, next) => {
    try {
        // FIX: Handle both req.user and req.user.user structures
        const userData = req.user?.user || req.user;
        
        if (!userData) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        
        console.log('User data in isAdmin:', userData);
        
        if (userData.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }
        
        next();
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        return res.status(500).json({ message: 'Internal server error in admin check' });
    }
};

module.exports = isAdmin;