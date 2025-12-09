import express from "express";
import {listarProducto} from '../controllers/productController.js';

const router = express.Router();

router.get('/products', listarProducto);


export default router;

