import { Routes } from '@angular/router';
import { Main } from './shared/components/main/main';

export const routes: Routes = [
  {
    path:"",
    component:Main
  },
  {
    path: 'categoria/:categoriaSlug',
    component: Main,
  },
  {
    path: 'docs/:categoriaSlug/:selector',
    loadComponent: () =>
      import('./features/docs/componente-page.component').then(
        (m) => m.ComponentePageComponent,
      ),
  },
  { path: '', redirectTo: 'docs/form-controls/app-button', pathMatch: 'full' },
];
