import express from 'express';
// Asegúrate de que la ruta de importación sea correcta (saliendo de routes y entrando a controllers)
import { getUsers, login, register } from '../controllers/userController.js';
import { verifyToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();
const endpoint = '/api/users';

// Rutas
router.get(endpoint, verifyToken, requireAdmin, getUsers);

// AHORA PROTEGEMOS ESTA RUTA: Necesitamos saber quién es el que lo añade
router.post(endpoint, verifyToken, register); 

router.post('/login', login);

export default router;