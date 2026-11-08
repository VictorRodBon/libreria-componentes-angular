import pool from '../config/db.js';

export const ComponenteModel={
  //obtener todo el catálogo agrupado
  async obtenerCatalogoCompleto(){
    // 1. Obtenemos todas las tablas necearias
    const [categorias] = await pool.query('SELECT * FROM categorias');
    const [componentes] = await pool.query('SELECT * FROM componentes');
    const [ejemplos] = await pool.query('SELECT * FROM ejemplos');

    // 2. Estructurar los datos en forma de arbol
    const catalogo = categorias.map(categoria => ({
      id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      componentes: componentes
        .filter(comp => comp.categoria_id === categoria.id)
        .map(comp => ({
          id: comp.id,
          nombre: comp.nombre,
          selector: comp.selector,
          descripcion: comp.descripcion,
          ejemplos: ejemplos.filter(ej => ej.componente_id === comp.id)
        }))
    }));

    return catalogo;
  }
}
