import { Routes } from '@angular/router';

export const routes: Routes = [
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
  {
    path: 'docs/:categoriaSlug/:selector',
    loadComponent: () =>
      import('./features/docs/componente-page.component').then(
        (m) => m.ComponentePageComponent,
      ),
  },
  { path: '', redirectTo: 'docs/form-controls/app-button', pathMatch: 'full' },
];
