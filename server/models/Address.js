import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId:{
        type:String,
        req:true
    },
    firstName:{
        type:String,
        req:true
    },
    lastName:{
        type:String,
        req:true
    },
    email:{
        type:String,
        req:true
    },
    street:{
        type:String,
        req:true
    },
    city:{
        type:String,
        req:true
    },
    state:{
        type:String,
        req:true
    },
    zipcode:{
        type:Number,
        req:true
    },
    country:{
        type:String,
        req:true
    },
    phone:{
        type:Number,
        req:true
    }
})

const Address = mongoose.models.address || mongoose.model('address',addressSchema)

export default Address