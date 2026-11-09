import { FavoritoModel } from '../models/favorito.model.js';

export const obtenerFavoritos = async (req, res) => {
    try {
        const favoritos = await FavoritoModel.obtenerPorUsuario(req.usuario.id);
        res.json({ success: true, data: favoritos });
    } catch (error) {
        console.error('Error al obtener favoritos:', error.message);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor al consultar los favoritos'
        });
    }
};