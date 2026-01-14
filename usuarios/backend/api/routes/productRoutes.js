import express from "express";
import { insertProductos, getProductos, updateProductos, deleteProducto } from "../controllers/productController.js";

const router = express.Router();

router.get('/', getProductos);
router.post("/", insertProductos);
router.put( "/:id", updateProductos);
router.delete("/:id", deleteProducto);

export default router;