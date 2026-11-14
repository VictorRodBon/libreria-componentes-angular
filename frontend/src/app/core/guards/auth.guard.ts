import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de rutas privadas.
 *
 * Deja pasar si hay sesión iniciada; si no, redirige a la página de inicio.
 * Uso en app.routes.ts: `canActivate: [authGuard]`.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn() ? true : router.createUrlTree(['/']);
};