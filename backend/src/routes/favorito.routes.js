import { Router } from 'express';
import { verificarToken } from '../middleware/auth.middleware.js';
import { obtenerFavoritos } from '../controllers/favorito.controller.js';

const router = Router();

router.get('/', verificarToken, obtenerFavoritos);

export default router;