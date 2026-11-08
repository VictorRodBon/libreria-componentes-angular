import { Router } from 'express';
import { obtenerCatalogo } from '../controllers/componente.controller.js';

const router = Router();

// Endpoint para obtener el catálogo completo de componentes
router.get('/componentes/catalogo', obtenerCatalogo);

export default router;
