import { Categoria, Ejemplo } from './componente.model';

/** Componente tal y como aparece en el listado del catálogo. */
export interface ComponenteResumen {
  id: number;
  nombre: string;
  selector: string;
  descripcion: string;
  ejemplos: Ejemplo[];
}

/** Categoría con su descripción y sus componentes (GET /api/componentes/catalogo). */
export interface CategoriaConComponentes extends Categoria {
  descripcion: string;
  componentes: ComponenteResumen[];
}

/** Datos mínimos que necesita una tarjeta de componente. */
export interface ComponenteTarjeta {
  id: number;
  nombre: string;
  selector: string;
  descripcion: string;
  ejemplos?: Ejemplo[];
}