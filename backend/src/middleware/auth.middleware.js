import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambialo';

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

    if (!token) {
        return res.status(403).json({ success: false, error: 'Token de autenticación requerido' });
    }

    jwt.verify(token, JWT_SECRET, (err, usuarioDecodificado) => {
        if (err) {
            return res.status(401).json({ success: false, error: 'Token inválido o expirado' });
        }

        req.usuario = usuarioDecodificado; // Guardamos los datos del usuario en la request
        next();
    });
};