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