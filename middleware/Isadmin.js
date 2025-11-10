// Will validate if the USer is admin or not


const isAdmin = (req,res,next) => {
    console.log(req.user);
    console.log(req.user.user.role);
    if(req.user && req.user.user.role === 'admin'){
        next();

    }
    else{
        return res.status(403).json({message: 'Admin Access Required'});

    }
}

module.exports = isAdmin;