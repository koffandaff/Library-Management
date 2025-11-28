const jwt = require('jsonwebtoken');

// Validation of the Access Token 
const validateToken = (req,res,next) => {
    const authheader = req.headers['authorization'];
    const token = authheader && authheader.split(' ')[1]; // separate and get the actual token 
    
    if(!token){
        return res.status(401).json({message: 'Access Token Missing'})
    } 

    try {
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "Dhruvil12345");
        
        // FIX: Keep the structure consistent - either use req.user OR req.user.user
        // Since your controllers expect req.user.user, keep it that way
        req.user = {
            user: user.user || user // Handle both formats for backward compatibility
        };
        
        next();
    } catch (error) {
        console.log('Token verification error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Access Token Expired',
                code: 'TOKEN_EXPIRED'
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                message: 'Invalid Access Token',
                error: 'Malformed token'
            });
        } else {
            return res.status(403).json({
                message: 'Invalid Access Token',
                error: error.message
            });
        }
    }
}

module.exports = validateToken;