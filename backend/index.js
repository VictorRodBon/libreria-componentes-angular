import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import componenteRoutes from './src/routes/componente.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import favoritoRoutes from './src/routes/favorito.routes.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// --- Middlewares ---
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' }));
app.use(express.json());

if (!process.env.JWT_SECRET) {
  console.error('FATAL: falta JWT_SECRET en el entorno');
  process.exit(1);
}

app.use('/api', componenteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favoritos', favoritoRoutes);
// ruta de prueba
app.get('/api', (req, res) => {
  res.json({ mensaje: '¡API funcionando correctamente con MariaDB!' });
});

// --- Frontend compilado (ng build) ---
// Sirve la aplicación Angular desde el mismo servidor: http://localhost:3000
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND = path.join(__dirname, '../frontend/dist/frontend/browser');
app.use(express.static(FRONTEND));
// Cualquier ruta que no sea de la API devuelve index.html y Angular Router decide qué página mostrar.
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(FRONTEND, 'index.html'));
});

// --- Manejo de rutas no encontradas y errores ---
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
