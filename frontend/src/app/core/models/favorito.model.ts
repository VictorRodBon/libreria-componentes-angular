import { Categoria } from './componente.model';

/**
 * Componente favorito tal y como lo devuelve GET /api/favoritos.
 * El usuario se deduce del JWT en el backend, no se envía desde el front.
 */
export interface Favorito {
  favorito_id: number;
  creado_en: string;
  id: number;
  nombre: string;
  selector: string;
  descripcion: string;
  categoria: Categoria;
}
