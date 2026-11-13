import bcrypt from 'bcrypt';
import { UsuarioModel } from '../models/usuario.model.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // 1. Cifrar la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 2. Guardar en la base de datos (el UNIQUE de email evita duplicados,
        //    incluidos los registros simultáneos: se captura ER_DUP_ENTRY abajo)
        const nuevoId = await UsuarioModel.crear(nombre, email, passwordHash);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado con éxito',
            data: { id: nuevoId, nombre, email }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, error: 'El correo electrónico ya está registrado.' });
        }
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ success: false, error: 'Error en el servidor al registrar usuario' });
    }
};

export const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar si el usuario existe
        const usuario = await UsuarioModel.buscarPorEmail(email);
        if (!usuario) {
            return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }

        // 2. Comparar la contraseña cifrada
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }

        // 3. Generar el JWT (expira en 24 horas)
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login exitoso',
            token,
            data: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ success: false, error: 'Error en el servidor al iniciar sesión' });
    }
};