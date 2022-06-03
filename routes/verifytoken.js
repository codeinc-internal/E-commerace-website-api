// middleware 
const jwt = require("jsonwebtoken")

const verifytoken = (req,res,next)=>{
    const authHeader= req.headers.token;
    // if we have token then we are gonna verify it 
    if(authHeader){
        const token = authHeader
        jwt.verify(token, process.env.JWT_SEC,(err,user)=>{
            if(err){
                return res.status(401).json("Token is not valid")
            }
            else{
                req.user=user
                next();
            }
        })
    }
    else{
        return res.status(401).json("you are not authenticated")
    }
}

const tokenAndAuth=(req,res,next)=>{
    verifytoken(req,res,()=>{
    if(req.user.id===req.params.id||req.user.isAdmin){
        next()
    }
    else{
        res.status(403).json("you are not Allowed")
    }
})
}
const tokenAndAdmin=(req,res,next)=>{
    verifytoken(req,res,()=>{
    if(req.user.isAdmin){
        next()
    }
    else{
        res.status(403).json("you are not Allowed")
    }
})
}
module.exports={tokenAndAuth,verifytoken,tokenAndAdmin}