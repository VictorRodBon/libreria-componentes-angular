import pool from '../config/db.js';

export const FavoritoModel = {
    async obtenerPorUsuario(usuarioId) {
        const [rows] = await pool.query(
            `SELECT
                f.id AS favorito_id,
                f.creado_en,
                c.id,
                c.nombre,
                c.selector,
                c.descripcion,
                cat.id   AS categoria_id,
                cat.nombre AS categoria_nombre,
                cat.slug   AS categoria_slug
            FROM favoritos f
            JOIN componentes c ON c.id = f.componente_id
            JOIN categorias cat ON cat.id = c.categoria_id
            WHERE f.usuario_id = ?
            ORDER BY f.creado_en DESC`,
            [usuarioId]
        );

        return rows.map(fila => ({
            favorito_id: fila.favorito_id,
            creado_en: fila.creado_en,
            id: fila.id,
            nombre: fila.nombre,
            selector: fila.selector,
            descripcion: fila.descripcion,
            categoria: {
                id: fila.categoria_id,
                nombre: fila.categoria_nombre,
                slug: fila.categoria_slug
            }
        }));
    },

    async obtenerPorUsuarioYComponente(usuarioId, componenteId) {
        const [rows] = await pool.query(
            'SELECT id FROM favoritos WHERE usuario_id = ? AND componente_id = ?',
            [usuarioId, componenteId]
        );
        return rows[0] ?? null;
    },

    async agregar(usuarioId, componenteId) {
        const [result] = await pool.query(
            'INSERT INTO favoritos (usuario_id, componente_id) VALUES (?, ?)',
            [usuarioId, componenteId]
        );
        return result.insertId;
    },

    async eliminarPorUsuarioIdYComponenteId(usuarioId, componenteId) {
        const [result] = await pool.query(
            'DELETE FROM favoritos WHERE usuario_id = ? AND componente_id = ?',
            [usuarioId, componenteId]
        );
        return result.affectedRows > 0;
    }
};