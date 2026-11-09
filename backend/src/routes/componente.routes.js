import { Router } from 'express';
import { obtenerCatalogo, obtenerCatalogoPorCategoria } from '../controllers/componente.controller.js';

const router = Router();

// Endpoint para obtener el catálogo completo de componentes
router.get('/componentes/catalogo', obtenerCatalogo);
router.get('/componentes/catalogo/:slug', obtenerCatalogoPorCategoria);

export default router;
