import { Routes } from '@angular/router';

/**
 * Ruta de ejemplo.
 *
 * Requiere en app.config.ts:
 *   provideRouter(routes, withComponentInputBinding())
 *
 * URL de prueba:
 *   /docs/form-controls/app-button
 */
export const routes: Routes = [
  {
    path: 'docs/:categoriaSlug/:selector',
    loadComponent: () =>
      import('./componente-page.component').then(
        (m) => m.ComponentePageComponent,
      ),
  },
];
