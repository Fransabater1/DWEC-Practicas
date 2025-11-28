import express from 'express';
// Asegúrate de que la ruta de importación sea correcta (saliendo de routes y entrando a controllers)
import { getUsuarios, login, registrar } from '../controllers/userController.js';
import { verifyToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();
const endpoint = '/api/users';

// Rutas
router.get(endpoint, verifyToken, requireAdmin, getUsuarios);

// AHORA PROTEGEMOS ESTA RUTA: Necesitamos saber quién es el que lo añade
router.post(endpoint, verifyToken, registrar); 

router.post('/login', login);

export default router;