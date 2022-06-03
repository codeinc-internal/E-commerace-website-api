const express = require("express");
const User = require("../models/User");
const Products = require("../models/Product")
const { verifytoken, tokenAndAuth, tokenAndAdmin } = require("./verifytoken");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const router = express.Router();

// Create
// only admin can create a product
router.post("/create",async(req,res)=>{
    const newCart = new Cart(req.body)
    try {
        const saveCart = await newCart.save()
        res.status(200).json(saveCart)
    } catch (error) {
        res.status(500).json(error)
    }
})


router.put("/update/:id",tokenAndAuth,async(req,res)=>{
   try {
       const updateCart = await Cart.findByIdAndUpdate(req.params.id,{
           $set:req.body
       },{new:true})
       res.status(200).json(updateCart)
   } catch (error) {
       res.status(500).json(error)
   }
})
router.delete("/delete/:id",tokenAndAuth,async(req,res)=>{
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("user has been deleted...")
    } catch (error) {
        res.status(500).json(error)
    }
})

// get user cart 
router.get("/get/:userId",tokenAndAuth,async(req,res)=>{
    try {
        const cart = await Cart.findOne({userId:req.params.userId})
        

        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json(error)
    }
})
// //get all 
router.get("/getAllCart/",tokenAndAdmin,async(req,res)=>{
    
    try {
      const carts =await Cart.find()
      res.status(200).json(carts)
    } catch (error) {
        res.status(500).json(error)
    }
})



module.exports = router;