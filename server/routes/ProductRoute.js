import express from 'express';
import { upload } from '../configs/Multer.js';
import authSeller from '../middleware/authSeller.js';
import { addProduct, changeStock, ProductById, ProductList } from '../controller/ProductController.js';

const productRouter = express.Router();

productRouter.post('/add',upload.array(["images"]),authSeller,addProduct);
productRouter.get('/list',ProductList);
productRouter.get('/id',ProductById);
productRouter.post('/stock',authSeller,changeStock);

export default productRouter