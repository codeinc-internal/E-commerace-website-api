const express = require("express");
const User = require("../models/User");
const { verifytoken, tokenAndAuth, tokenAndAdmin } = require("./verifytoken");
const router = express.Router();

router.put("/update/:id",tokenAndAuth,async(req,res)=>{
   try {
       const updateUser = await User.findByIdAndUpdate(req.params.id,{
           $set:req.body
       },{new:true})
       res.status(200).json(updateUser)
   } catch (error) {
       res.status(500).json(error)
   }
})
router.delete("/delete/:id",tokenAndAuth,async(req,res)=>{
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("user has been deleted...")
    } catch (error) {
        res.status(500).json(error)
    }
})
router.get("/getUser/:id",tokenAndAdmin,async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        const {password,...others}=user._doc;

        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
    }
})
//get all user
router.get("/getAllUser",tokenAndAdmin,async(req,res)=>{
    const query = req.query.new
    try {
        const user = query ?await User.find().sort({_id:-1}).limit(5): await User.find();
        const {password,...others}=user._doc;

        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Get user stats
router.get("/stats",tokenAndAdmin,async(req,res)=>{
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1))
    try {
        const data = await User.aggregate([
            {$match:{
                createdAt:{$gte:lastYear}
            }},{
            $project:{
                month:{$month:"$createdAt"}
            }
        },
        {
            $group:{
                _id:"$month",
                total:{$sum:1}
            }
        }
        ])
        res.status(200).send(data)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;