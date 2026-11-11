import { Router } from 'express';
import { verificarToken } from '../middleware/auth.middleware.js';
import { obtenerFavoritos, agregarFavorito, eliminarFavorito } from '../controllers/favorito.controller.js';
import { param, validationResult } from 'express-validator';

const router = Router();

const validar = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ success: false, errors: errores.array() });
    }
    next();
};

router.get('/', verificarToken, obtenerFavoritos);
router.post('/:componenteId', verificarToken, param('componenteId').isInt({ min: 1 }).toInt(), validar, agregarFavorito);
router.delete('/:componenteId', verificarToken, param('componenteId').isInt({ min: 1 }).toInt(), validar, eliminarFavorito);

export default router;
