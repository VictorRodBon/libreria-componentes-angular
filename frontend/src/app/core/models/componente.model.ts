export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

export interface Ejemplo {
  id: number;
  titulo: string;
  codigo_html: string;
  codigo_ts: string;
  demo_key: string | null;
  orden: number;
}

export interface Componente {
  id: number;
  nombre: string;
  selector: string;
  descripcion: string;
  categoria: Categoria;
  ejemplos: Ejemplo[];
}
