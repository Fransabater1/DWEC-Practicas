import express from 'express';
import { getProductes,putProductes, postProductes, deleteProductes, login } from '../controllers/productController.js';
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/api/productes", getProductes, verifyToken);
router.post("/api/productes", postProductes, verifyToken);
router.put("/api/productes/:id", putProductes, verifyToken);
router.delete("/api/productes/:id", deleteProductes, verifyToken);

router.post('/api/login', login);
export default router;