import { Categoria, Ejemplo } from './componente.model';

export interface ComponenteResumen {
  id: number;
  nombre: string;
  selector: string;
  descripcion: string;
  ejemplos: Ejemplo[];
}

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