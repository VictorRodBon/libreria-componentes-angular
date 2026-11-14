import { Routes } from '@angular/router';
import { Main } from './shared/components/main/main';
import { Favoritos } from './shared/components/favoritos/favoritos';
import { Layout } from './shared/components/layout/layout';
import { authGuard } from './core/guards/auth.guard';
import { Inicio } from './shared/components/inicio/inicio';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Inicio,
      },
      {
        path: 'categoria',
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
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./features/auth/register.component').then((m) => m.RegisterComponent),
  },
  { path: '**', redirectTo: '' },
];
