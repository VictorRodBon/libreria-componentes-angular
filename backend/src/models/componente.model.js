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

const CAMPOS_EJEMPLO = 'id, componente_id, titulo, codigo_html, codigo_ts, demo_key, orden';

// Normaliza un ejemplo: demo_key siempre presente (string o null)
const mapearEjemplo = (ejemplo) => ({
  id: ejemplo.id,
  titulo: ejemplo.titulo,
  codigo_html: ejemplo.codigo_html,
  codigo_ts: ejemplo.codigo_ts,
  demo_key: ejemplo.demo_key ?? null,
  orden: ejemplo.orden
});

const mapearComponente = (componente, ejemplos = []) => ({
  id: componente.id,
  nombre: componente.nombre,
  selector: componente.selector,
  descripcion: componente.descripcion,
  ejemplos: ejemplos.map(mapearEjemplo)
});

const buscarCategoriaPorSlug = async (slug) => {
  const [rows] = await pool.query(
    'SELECT id, nombre, slug, descripcion FROM categorias WHERE slug = ?',
    [slug]
  );
  return rows[0] ?? null;
};

export const ComponenteModel = {
  // Obtener todo el catálogo agrupado
  async obtenerCatalogoCompleto() {
    const [[categorias], [componentes], [ejemplos]] = await Promise.all([
      pool.query('SELECT id, nombre, slug, descripcion FROM categorias ORDER BY id'),
      pool.query(
        'SELECT id, categoria_id, nombre, selector, descripcion FROM componentes ORDER BY id'
      ),
      pool.query(
        `SELECT ${CAMPOS_EJEMPLO} FROM ejemplos ORDER BY componente_id, orden`
      )
    ]);

    const ejemplosPorComponente = agruparPor(ejemplos, 'componente_id');
    const componentesPorCategoria = agruparPor(componentes, 'categoria_id');

    return categorias.map((categoria) => ({
      id: categoria.id,
      nombre: categoria.nombre,
      slug: categoria.slug,
      descripcion: categoria.descripcion,
      componentes: (componentesPorCategoria.get(categoria.id) ?? []).map((comp) =>
        mapearComponente(comp, ejemplosPorComponente.get(comp.id) ?? [])
      )
    }));
  },

  async obtenerCategoriaPorSlug(slug) {
    return buscarCategoriaPorSlug(slug);
  },

  async obtenerCatalogoPorCategoria(slug) {
    const categoria = await buscarCategoriaPorSlug(slug);
    if (!categoria) return null;

    const [componentes] = await pool.query(
      'SELECT id, nombre, selector, descripcion FROM componentes WHERE categoria_id = ? ORDER BY id',
      [categoria.id]
    );

    if (componentes.length === 0) {
      return { ...categoria, componentes: [] };
    }

    const [ejemplos] = await pool.query(
      `SELECT ${CAMPOS_EJEMPLO}
       FROM ejemplos
       WHERE componente_id IN (?)
       ORDER BY componente_id, orden`,
      [componentes.map((comp) => comp.id)]
    );

    const ejemplosPorComponente = agruparPor(ejemplos, 'componente_id');

    return {
      ...categoria,
      componentes: componentes.map((comp) =>
        mapearComponente(comp, ejemplosPorComponente.get(comp.id) ?? [])
      )
    };
  },

  // Detalle de un componente por selector (el selector es UNIQUE en la BD)
  async obtenerComponentePorSelector(selector) {
    const [rows] = await pool.query(
      `SELECT c.id, c.nombre, c.selector, c.descripcion,
              cat.id AS categoria_id,
              cat.nombre AS categoria_nombre,
              cat.slug AS categoria_slug
       FROM componentes AS c
       JOIN categorias AS cat ON cat.id = c.categoria_id
       WHERE c.selector = ?`,
      [selector]
    );

    const componente = rows[0];
    if (!componente) return null;

    const [ejemplos] = await pool.query(
      `SELECT ${CAMPOS_EJEMPLO}
       FROM ejemplos
       WHERE componente_id = ?
       ORDER BY orden`,
      [componente.id]
    );

    return {
      id: componente.id,
      nombre: componente.nombre,
      selector: componente.selector,
      descripcion: componente.descripcion,
      categoria: {
        id: componente.categoria_id,
        nombre: componente.categoria_nombre,
        slug: componente.categoria_slug
      },
      ejemplos: ejemplos.map(mapearEjemplo)
    };
  },

  // Comprobar si existe un componente por id
  async existe(componenteId) {
    const [rows] = await pool.query('SELECT id FROM componentes WHERE id = ?', [componenteId]);
    return rows.length > 0;
  }
};
