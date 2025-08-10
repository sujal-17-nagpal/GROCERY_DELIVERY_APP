import User from "../models/User.js"

// Update cart cartData : /api/cart/update

export const updateCart = async(req,res)=>{
    try{
        const {userId,cartItems} = req.body
        await User.findByIdAndUpdate(userId,{cartItems})
        res.status(200).json({success:true,message:"cart updated"})
    } catch(err){
        console.log(err.message)
        res.status(400).json({message:err.message})
    }
}