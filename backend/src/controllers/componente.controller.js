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

