import { Componente } from './componente.model';

/**
 * Datos de ejemplo para poder probar la demo sin levantar el backend.
 * En la app real estos datos vienen de GET /api/componentes/:selector
 */
export const MOCK_COMPONENTE: Componente = {
  id: 1,
  nombre: 'Button',
  selector: 'app-button',
  descripcion:
    'Botón interactivo personalizable con múltiples variantes visuales.',
  categoria: {
    id: 1,
    nombre: 'Form Controls',
    slug: 'form-controls',
  },
  ejemplos: [
    {
      id: 1,
      titulo: 'Botón primario',
      codigo_html: '<app-button color="primary">Guardar</app-button>',
      codigo_ts: 'export class ButtonExample {}',
      demo_key: 'button-primary',
      orden: 1,
    },
    {
      id: 2,
      titulo: 'Botón secundario deshabilitado',
      codigo_html:
        '<app-button color="secondary" [disabled]="true">Cancelar</app-button>',
      codigo_ts: 'export class ButtonExample { disabled = true; }',
      demo_key: 'button-secondary',
      orden: 2,
    },
  ],
};
