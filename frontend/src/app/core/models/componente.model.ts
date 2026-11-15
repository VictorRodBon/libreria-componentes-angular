/** Categoría del catálogo. El `slug` se usa en las URLs (/categoria/:slug). */
export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

/**
 * Ejemplo de uso de un componente. El código se guarda como texto en la base
 * de datos; `demo_key` indica qué demo real del frontend se carga (ver DemoRegistry).
 */
export interface Ejemplo {
  id: number;
  titulo: string;
  codigo_html: string;
  codigo_ts: string;
  codigo_css: string | null;
  demo_key: string | null;
  orden: number;
}

/** Componente completo con su categoría y sus ejemplos (GET /api/componentes/:selector). */
export interface Componente {
  id: number;
  nombre: string;
  selector: string;
  descripcion: string;
  categoria: Categoria;
  ejemplos: Ejemplo[];
}
