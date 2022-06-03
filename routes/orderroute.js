const express = require("express");
const User = require("../models/User");
const Products = require("../models/Product")
const { verifytoken, tokenAndAuth, tokenAndAdmin } = require("./verifytoken");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const router = express.Router();

// Create
// only admin can create a product
router.post("/create",async(req,res)=>{
    const newOrder = new Order(req.body)
    try {
        const saveOrder = await newOrder.save()
        res.status(200).json(saveOrder)
    } catch (error) {
        res.status(500).json(error)
    }
})


router.put("/update/:id",tokenAndAdmin,async(req,res)=>{
   try {
       const updateOrder = await Order.findByIdAndUpdate(req.params.id,{
           $set:req.body
       },{new:true})
       res.status(200).json(updateOrder)
   } catch (error) {
       res.status(500).json(error)
   }
})
router.delete("/delete/:id",tokenAndAdmin,async(req,res)=>{
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("user has been deleted...")
    } catch (error) {
        res.status(500).json(error)
    }
})

// get user Order
router.get("/get/:userId",tokenAndAuth,async(req,res)=>{
    try {
        const Orders= await Order.findOne({userId:req.params.userId})
        

        res.status(200).json(Orders)
    } catch (error) {
        res.status(500).json(error)
    }
})
// //get all 
router.get("/getAllOrder/",tokenAndAdmin,async(req,res)=>{
    
    try {
      const Orders =await Order.find()
      res.status(200).json(Orders)
    } catch (error) {
        res.status(500).json(error)
    }
})
// GET monthly income
router.get("/income",tokenAndAdmin,async(req,res)=>{
    const date = new Date();
    const lastMonth= new Date(date.setMonth(date.getMonth()-1))
    const previousMonth= new Date(date.setMonth(lastMonth.getMonth()-1))
    try {
        const Income=await Order.aggregate([
            {$match:{createdAt:{$agt:previousMonth}}},
            {
                $project:{
                    month:{$month:"$createdAt"},
                    sales:"$amount",
                     
                },
                $group:{
                    _id:"$month",
                    total:{$sum:"$sales"}
                }
            }
        ])
        res.status(200).json(Income)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router;