import pool from '../config/db.js';

export const UsuarioModel = {
  // Buscar usuario por correo (para evitar duplicados)
    async buscarPorEmail(email) {
        const [rows] = await pool.query('SELECT id, nombre, email, password FROM usuarios WHERE email = ?', [email]);
        return rows[0];
    },

  // Crear un nuevo usuario
    async crear(nombre, email, passwordHash) {
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, passwordHash]
        );
        return result.insertId;
    }
};