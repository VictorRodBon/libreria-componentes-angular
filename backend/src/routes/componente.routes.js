import { Router } from 'express';
import {
  obtenerCatalogo,
  obtenerCatalogoPorCategoria,
  obtenerComponentePorSelector
} from '../controllers/componente.controller.js';

const router = Router();

// Endpoint para obtener el catálogo completo de componentes
router.get('/componentes/catalogo', obtenerCatalogo);
router.get('/componentes/catalogo/:slug', obtenerCatalogoPorCategoria);
router.get('/componentes/:selector', obtenerComponentePorSelector);

export default router;
