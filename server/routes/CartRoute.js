import mongoose from "mongoose";
import express from 'express'
import  authUser  from "../middleware/authUser.js";
import { updateCart } from "../controller/CartController.js";

const cartRouter = express.Router()

cartRouter.post('/update',authUser,updateCart)

export default cartRouter