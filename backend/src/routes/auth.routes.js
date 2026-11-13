import { Router } from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/auth.controller.js';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

const router = Router();

const validar = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ success: false, errors: errores.array() });
    }
    next();
};

// Límite de intentos de login: 10 por IP cada 15 minutos
const limiterLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, error: 'Demasiados intentos de inicio de sesión. Inténtalo de nuevo en unos minutos.' }
});

router.post('/register', [
    body('nombre').trim().notEmpty().isLength({ max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 })
], validar, registrarUsuario);

router.post('/login', limiterLogin, [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], validar, loginUsuario);

export default router;