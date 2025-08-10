import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDb from './configs/db.js';
import 'dotenv/config'
import userRouter from './routes/UserRoute.js';
import sellerRouter from './routes/SellerRoute.js';
import connectCloudinary from './configs/Cloudinary.js';
import productRouter from './routes/ProductRoute.js';
import cartRouter from './routes/CartRoute.js';
import addressRouter from './routes/AddressRoute.js';
import orderRouter from './routes/OrderRoute.js';
import { stripeWebhooks } from './controller/OrderController.js';

const app = express();
const port = process.env.PORT || 4000;

await connectDb()
await connectCloudinary()


app.post('/strive',express.raw({type:'application/json'}),stripeWebhooks)

//MIDDLE WARE CONFIGURATION

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ['http://localhost:5173']
app.use(cors({origin : allowedOrigins , credentials : true}))

app.get('/',(req,res)=>{
    res.send("API is working")
});

app.use('/api/user',userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
    // console.log("Hello World")
})
