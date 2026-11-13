import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'docs/:categoriaSlug/:selector',
    loadComponent: () =>
      import('./features/docs/componente-page.component').then(
        (m) => m.ComponentePageComponent,
      ),
  },
  { path: '', redirectTo: 'docs/form-controls/app-button', pathMatch: 'full' },
];
