import pool from '../config/db.js';

// Agrupa filas por una clave para evitar recorrer arrays completos por cada elemento
const agruparPor = (filas, clave) => {
  const mapa = new Map();
  for (const fila of filas) {
    const valor = fila[clave];
    if (!mapa.has(valor)) mapa.set(valor, []);
    mapa.get(valor).push(fila);
  }
  return mapa;
};

const buscarCategoriaPorSlug = async (slug) => {
  const [rows] = await pool.query('SELECT * FROM categorias WHERE slug = ?', [slug]);
  return rows[0] ?? null;
};

export const ComponenteModel={
  //obtener todo el catálogo agrupado
  async obtenerCatalogoCompleto(){
    // 1. Obtenemos todas las tablas necesarias
    const [
      [categorias],
      [componentes],
      [ejemplos]
    ] = await Promise.all([
      pool.query('SELECT * FROM categorias ORDER BY id'),
      pool.query('SELECT * FROM componentes ORDER BY id'),
      pool.query('SELECT * FROM ejemplos ORDER BY orden')
    ]);

    // 2. Estructurar los datos en forma de árbol usando índices
    const ejemplosPorComponente = agruparPor(ejemplos, 'componente_id');
    const componentesPorCategoria = agruparPor(componentes, 'categoria_id');

    return categorias.map(categoria => ({
      id: categoria.id,
      nombre: categoria.nombre,
      slug: categoria.slug,
      descripcion: categoria.descripcion,
      componentes: (componentesPorCategoria.get(categoria.id) ?? []).map(comp => ({
        id: comp.id,
        nombre: comp.nombre,
        selector: comp.selector,
        descripcion: comp.descripcion,
        ejemplos: ejemplosPorComponente.get(comp.id) ?? []
      }))
    }));
  },

  async obtenerCategoriaPorSlug(slug){
    return buscarCategoriaPorSlug(slug);
  },

  async obtenerCatalogoPorCategoria(slug){
    const categoria = await buscarCategoriaPorSlug(slug);
    if (!categoria) return null;

    const [componentes] = await pool.query(
      'SELECT * FROM componentes WHERE categoria_id = ? ORDER BY id',
      [categoria.id]
    );

    const componentesConEjemplos = componentes.map(comp => ({
      id: comp.id,
      nombre: comp.nombre,
      selector: comp.selector,
      descripcion: comp.descripcion,
      ejemplos: []
    }));

    if (componentes.length > 0) {
      const [ejemplos] = await pool.query(
        'SELECT * FROM ejemplos WHERE componente_id IN (?) ORDER BY orden',
        [componentes.map(comp => comp.id)]
      );

      const ejemplosPorComponente = agruparPor(ejemplos, 'componente_id');
      for (const comp of componentesConEjemplos) {
        comp.ejemplos = ejemplosPorComponente.get(comp.id) ?? [];
      }
    }

    return {
      id: categoria.id,
      nombre: categoria.nombre,
      slug: categoria.slug,
      descripcion: categoria.descripcion,
      componentes: componentesConEjemplos
    };
  }
}
