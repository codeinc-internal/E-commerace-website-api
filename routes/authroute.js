const express = require("express");
const router = express.Router();
const User = require("../models/User")
const jwt = require("jsonwebtoken")
// Register 
router.post("/register",async(req,res)=>{
    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
    })
    
      try {
          const savedUser = await newUser.save()
           res.status(201).json(savedUser)
      } catch (error) {
          res.status(500).json(err)
      }
    
})
// Login
router.post("/login",async(req,res)=>{
    try {
        let user = await User.findOne({username:req.body.username})
        if(!user){
            res.status(500).send("username does not exit")
        }
        if(user.password!==req.body.password){
            res.status(404).send("wrong password")
        }
        // create a jwt token 
        const accessToker = jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin
        },process.env.JWT_SEC,
        {expiresIn:"3d"})
        // 
        const {password,...others}=user._doc;
        res.status(200).json({...others,accessToker})
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;