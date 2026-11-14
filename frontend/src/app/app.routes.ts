import { Routes } from '@angular/router';
import { Main } from './shared/components/main/main';
import { Favoritos } from './shared/components/favoritos/favoritos';
import { Layout } from './shared/components/layout/layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Main,
      },
      {
        path: 'categoria/:categoriaSlug',
        component: Main,
      },
      {
        path: 'favoritos',
        canActivate: [authGuard],
        component: Favoritos,
      },
      {
        path: 'docs/:categoriaSlug/:selector',
        loadComponent: () =>
          import('./features/docs/componente-page.component').then(
            (m) => m.ComponentePageComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
