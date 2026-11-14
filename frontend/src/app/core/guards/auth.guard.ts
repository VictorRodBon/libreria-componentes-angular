import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de rutas privadas.
 *
 * Deja pasar si hay sesión iniciada; si no, redirige al login
 * y recuerda a dónde quería ir el usuario.
 * Uso en app.routes.ts: `canActivate: [authGuard]`.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  if (auth.estaAutenticado()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
