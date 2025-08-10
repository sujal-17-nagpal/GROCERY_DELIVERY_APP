
import Address from "../models/Address.js"

// Add address : /api/address/add

export const addAddress = async(req,res)=>{
    console.log(`req.body1 ${req.body}`)
    try{
        const {address,userId} = req.body
        // console.log(userId)
        await Address.create({...address,userId})
        res.status(200).json({success:true,message:"address added successfully"})
    } catch(err){ 
        console.log("err.message")
        res.status(400).json({message:err.message})
    }
}

// Get Address : /api/address/get


export const getAddress = async(req,res)=>{
    // console.log(user)
    // console.log(`req.body2 ${req.body}`)
    try{
        const {userId} = req.userId
        // console.log(userId)
        const addresses = await Address.find({userId})
        res.status(200).json({success:true,addresses})
    } catch(err){
        // console.log(err.message)
        res.status(400).json({message:err.message})
    }
}
