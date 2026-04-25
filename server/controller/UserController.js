import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

//REGISTER USER: /api/user/register
export const register = async(req,res)=>{
    try{
        const {email,name,password} = req.body
        if(!name || !email || !password){
            return res.status(400).json({message:"required fields cannot be empty"})
        }
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"User with this email already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({name,email,password :hashedPassword})

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true, //PREVENT JAVASCRIPT TO ACCESS COOKIE
            secure:process.env.NODE_ENV === 'production',//USE SECURE COOKIE IN PRODUCTION
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict', //CSRF PROTECTION
            maxAge:7*24*60*60*1000, //COOKIE EXPIRATION TIME IN MILLISEC
        })

        return res.status(200).json({success:true,user:{email:user.email,name:user.name}})

    } catch(err){
        console.log(err.message);
        return res.status(400).json({message:err.message})
    }
}

//LOGIN USER : api/user/login

export const login = async(req,res)=>{
    try{
        const{email,password} = req.body
        if(!email || !password){
            return res.status(404).json({message:"email and password are required"})
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"invalid email or password"})
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true, //PREVENT JAVASCRIPT TO ACCESS COOKIE
            secure:process.env.NODE_ENV === 'production',//USE SECURE COOKIE IN PRODUCTION
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict', //CSRF PROTECTION
            maxAge:7*24*60*60*1000, //COOKIE EXPIRATION TIME IN MILLISEC
        })

        return res.status(200).json({success:true,user:{email:user.email,name:user.name}})
    } catch(error){
        console.log(error.message)
        res.status(400).json({message:error.message})
    }
}

//api/user/is-auth
export const isAuth = async(req,res)=>{
    try{
        // console.log(req.body)

        const userId = req.userId;
        // console.log(userId)
        const user = await User.findById(userId).select("-password")
        return res.status(200).json({ status: 200, user });

    } catch(error){
        // console.log(error.message)
        res.status(400).json({message:error.message})
    }

    // try{
    //     return res.status(200).json({success:true})
    // }
    // catch(error){
    //     res.status(400).json({message:error.message})
    // }
}

//log-out-user : /api/user/logout
export const logout = async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict'

        })
        return res.status(200).json({staus:200,message:"Logged out"})
    } catch(error){
        console.log(error.message)
        res.status(400).json({message:error.message})
    }
}