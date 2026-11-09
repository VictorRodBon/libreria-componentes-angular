import { ComponenteModel } from '../models/componente.model.js';

export const obtenerCatalogo = async (req, res) => {
  try{
    const catalogo = await ComponenteModel.obtenerCatalogoCompleto();
    res.json({
      success: true,
      data: catalogo
    });
  }catch(error){
    console.error('Error al obtener el catálogo de componentes:', error.message);
    res.status(500).json({
      success:false,
      error: "Error interno del servidor al consultar el catalogo"
    })
  }
}

export const obtenerCatalogoPorCategoria = async (req, res) => {
  try{
    const { slug } = req.params;
    const categoria = await ComponenteModel.obtenerCatalogoPorCategoria(slug);

    if (!categoria) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }

    res.json({ success: true, data: categoria });
  }catch(error){
    console.error('Error al obtener el catálogo de componentes por categoría:', error.message);
    res.status(500).json({ success: false, error: 'Error interno del servidor al consultar el catálogo por categoría' });
  }
}

export const obtenerComponentePorSelector = async (req, res) => {
  try {
    const { selector } = req.params;
    const componente = await ComponenteModel.obtenerComponentePorSelector(selector);

    if (!componente) {
      return res.status(404).json({ success: false, error: 'Componente no encontrado' });
    }

    res.json({ success: true, data: componente });
  } catch (error) {
    console.error('Error al obtener el componente por selector:', error.message);
    res.status(500).json({ success: false, error: 'Error interno del servidor al consultar el componente' });
  }
}
