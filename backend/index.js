import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import componenteRoutes from './src/routes/componente.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import favoritoRoutes from './src/routes/favorito.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

app.use('/api', componenteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favoritos', favoritoRoutes);
// ruta de prueba
app.get('/', (req,res)=>{
  res.json({mesaje:'¡API funcionando correctamente con MariaDB!'});
})

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
