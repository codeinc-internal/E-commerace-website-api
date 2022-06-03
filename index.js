const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const userRoutes=require("./routes/userRoutes");
const userAuth = require("./routes/authroute")
const productRoute= require("./routes/productroute")
const OrderRoute= require("./routes/orderroute")
const CartRoute = require("./routes/cartroute")

dotenv.config();

const app=express();
app.use(express.json())
const url =process.env.MONGO_URL
mongoose.connect(url).then(()=>console.log("connection  successful")).catch((err)=>console.log(err))

app.use("/api/user",userRoutes)
app.use("/api/auth",userAuth)
app.use("/api/Product",productRoute)
app.use("/api/order",OrderRoute)
app.use("/api/Cart",CartRoute)


app.listen(3000,()=>{
    console.log("server is running ");
})

