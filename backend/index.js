import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import componenteRoutes from './src/routes/componente.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

app.use('/api', componenteRoutes);

// ruta de prueba
app.get('/', (req,res)=>{
  res.json({mesaje:'¡API funcionando correctamente con MariaDB!'});
})

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
