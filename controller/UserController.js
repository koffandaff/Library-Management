const express = require('express');
const { validateEmail, validatePassword } = require('../utility/Validemailandpass');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')

const mAuthors = require('../config/MockData').mAuthors;
const mUsers = require('../config/MockData').mUsers;
const validateToken = require('../middleware/validateToken');
const users = require('../schema/UserSchema');




// Login a user 
//@desc Login a user
//@route POST /api/user/login
//@access public
const login = asyncHandler( async (req,res) => {
    const {email, password} = req.body;
    // checking if email and password are provided 
    if(!email || !password){
        return res.status(400).json({message: 'All fields are required'})

    }

    // See if user exsits 
    const user = await users.findOne({email: email});
    if(!user){

        return res.status(401).json({message: 'User Not Found'})
    }
    //. uf user exsits then compare the password 
    else{
        if( await !bcrypt.compareSync(password, user.password)){
            return res.status(401).json({message: 'Invalid Credentials'})
        }
        else{ // if password matches then creation of jwt token 
            const accessToken = jwt.sign(
                {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role

                } 
            }, 
                "Dhruvil12345", // this should be in env variable but it's fine fro now
                {expiresIn: '20m'}

            
            );
            res.json({message: 'Login Successful', user: user.name, accessToken})
        }
    }


} )

// Register a user 
//@desc Register a user
//@route POST /api/user/register
//@access public
const register = asyncHandler (async (req,res) => {
    const {name, email, password, role, adminkey} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message: 'Please provide all required Fields: name ,email and password'})
    }
    // if user already exits 
    const useravail = await users.findOne({email: email});
    if(useravail){
        return res.status(400).json({message: 'USer already exists with this email '})
    }

    // Validate Email and Password

    if(!validateEmail(email)){
        return res.status(400).json({message: "Please enter a valid email address"})
    }
    
    if(!validatePassword(password)){
        return res.status(400).json({message: "Password must be atleast 8 characters long and contain at least one letter and one number"})
    }

    if(role && role !== 'user' && role !== 'admin'){
        return res.status(400).json({message: 'Invalid ROle specified'})

    }
    // if role addmin then check the admin key 
    if(role === 'admin'){
        if(adminkey && adminkey === '123'){ // proceed ( key should be in env but for simplicity it's here )
        }
        else{
            return res.status(403).json({message: 'Invalid ADmin key or not provided'})
        }
    }

    const hashedPassword = bcrypt.hashSync(password,10); // Hashing of the password before storing 
    

    const newUser = {
        
        name,
        email,
        password: hashedPassword,
        role: role || 'user'

    }
    //Creation of user 
    const createdUser = await  users.create(newUser);
    users.findById(createdUser._id).then((user) => {
       newUser._id = user._id; 
    })
    console.log("New User Regusterd:", newUser)
    res.status(201).json({message: 'User REgsistered Successfully', user: newUser})

} )

// Current User Info
//@desc Info of Current User
//@route GET /api/user/current
//@access private
const currentUser = (req,res) => {
    // req.user is set in the validateToken Middleware
    // we will call it here
    res.json({user: req.user})
}

// Get all users 
//@desc Info of Current User
//@route GET /api/user/
//@access private
const getAllUsers = (req,res) => {
    //list all users 
    users.find().then((alluser) => {
        res.json({users: alluser})

    })
}

// Delete a user 
//@desc Delete a user
//@route DELETE /api/user/delete/:id
//@access private
const deleteUser = asyncHandler( async(req,res) => {
    const user = await users.findById(req.params.id);
    if(!user){ // check if user exsits
        res.status(404).json({message: "User Not Found"})
        
    }
    else{
        await users.findByIdAndDelete(req.params.id); // delete the user by id 
        res.status(200).json({message: "User deleted SuccessFully", user: user}) 
    }

    


    

})


module.exports = { login, register, currentUser, getAllUsers, deleteUser};


