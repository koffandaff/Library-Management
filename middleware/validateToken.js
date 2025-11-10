// Validation of the Access Token 

const jwt = require('jsonwebtoken');

const validateToken = (req,res,next) => {
    const authheader = req.headers['authorization'];
    const token = authheader && authheader.split(' ')[1]; // seprate and get the actual token 
    // console.log(token, 'sdf')
    if(!token){
        return res.status(401).json({message: 'Access Token Missing'}) // if token not provided then return 

    }
    jwt.verify(token, "Dhruvil12345", (err, user) => { // Checks the token using the key we provided 
        console.log('dsf', user, err)
        if(err){
            return res.status(403).json({mesasge: 'Invalid Access Token', error: err});

        }
        req.user = user; 
        next(); // if the token is valid then process those details 
    })

}
module.exports = validateToken;