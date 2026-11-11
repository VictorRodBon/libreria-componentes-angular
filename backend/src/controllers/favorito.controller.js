import { FavoritoModel } from '../models/favorito.model.js';
import { ComponenteModel } from '../models/componente.model.js';

export const obtenerFavoritos = async (req, res) => {
    try {
        const favoritos = await FavoritoModel.obtenerPorUsuario(req.usuario.id);
        res.json({ success: true, data: favoritos });
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor al consultar los favoritos'
        });
    }
};

export const agregarFavorito = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const { componenteId } = req.params;

        // 1. Comprobar que el componente existe (evita un 500 por FOREIGN KEY)
        const componenteExiste = await ComponenteModel.existe(componenteId);
        if (!componenteExiste) {
            return res.status(404).json({ success: false, error: 'Componente no encontrado' });
        }

        // 2. Comprobar si ya está en favoritos
        const favoritoExistente = await FavoritoModel.obtenerPorUsuarioYComponente(usuarioId, componenteId);
        if (favoritoExistente) {
            return res.status(400).json({ success: false, error: 'El componente ya está en favoritos' });
        }

        // 3. Agregar
        await FavoritoModel.agregar(usuarioId, componenteId);
        res.status(201).json({ success: true, message: 'Componente agregado a favoritos correctamente' });
    } catch (error) {
        console.error('Error al agregar a favoritos:', error);
        res.status(500).json({ success: false, error: 'Error interno del servidor al agregar a favoritos' });
    }
};

export const eliminarFavorito = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const { componenteId } = req.params;

        const eliminado = await FavoritoModel.eliminarPorUsuarioIdYComponenteId(usuarioId, componenteId);
        if (!eliminado) {
            return res.status(404).json({ success: false, error: 'El componente no está en favoritos' });
        }
        res.json({ success: true, message: 'Componente eliminado de favoritos correctamente' });
    } catch (error) {
        console.error('Error al eliminar de favoritos:', error);
        res.status(500).json({ success: false, error: 'Error interno del servidor al eliminar de favoritos' });
    }
};
