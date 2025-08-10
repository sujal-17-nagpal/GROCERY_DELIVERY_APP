import express from 'express'
import  authUser  from '../middleware/authUser.js'
import { getAllOrders, getUserOrder, placeOrderCOD, placeOrderStripe } from '../controller/OrderController.js'
import authSeller from '../middleware/authSeller.js'

const orderRouter = express.Router()

orderRouter.post('/cod',authUser,placeOrderCOD)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.get('/user',authUser,getUserOrder)
orderRouter.get('/seller',authSeller,getAllOrders)

export default orderRouter