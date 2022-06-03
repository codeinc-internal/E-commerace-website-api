const express = require("express");
const User = require("../models/User");
const Products = require("../models/Product")
const { verifytoken, tokenAndAuth, tokenAndAdmin } = require("./verifytoken");
const Product = require("../models/Product");
const router = express.Router();

// Create
// only admin can create a product
router.post("/create",tokenAndAdmin,async(req,res)=>{
    const newProduct = new Products(req.body)
    try {
        const saveProduct = await newProduct.save()
        res.status(200).json(saveProduct)
    } catch (error) {
        res.status(500).json(error)
    }
})


router.put("/update/:id",tokenAndAdmin,async(req,res)=>{
   try {
       const updateProduct = await Products.findByIdAndUpdate(req.params.id,{
           $set:req.body
       },{new:true})
       res.status(200).json(updateProduct)
   } catch (error) {
       res.status(500).json(error)
   }
})
router.delete("/delete/:id",tokenAndAdmin,async(req,res)=>{
    try {
        await Products.findByIdAndDelete(req.params.id)
        res.status(200).json("user has been deleted...")
    } catch (error) {
        res.status(500).json(error)
    }
})

// EVery body can see it
router.get("/getProduct/:id",async(req,res)=>{
    try {
        const product = await Products.findById(req.params.id)
        

        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
})
// //get all Product
router.get("/getAllProduct/",async(req,res)=>{
    const query = req.query.new
    const queryCategory = req.query.category
    try {
        let products;
        if(query){
            products = await Products.find().sort({createdAt:-1}).limit(5)
        }
        else if(queryCategory){
            products= await Products.find({categories:{
                $in:[queryCategory]
            }})
        }
        else{
            products= await Products.find()
        }
        res.status(200).json( products)
    } catch (error) {
        res.status(500).json(error)
    }
})



module.exports = router;