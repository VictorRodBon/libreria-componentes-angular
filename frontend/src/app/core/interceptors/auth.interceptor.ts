import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor de autenticación.
 *
 * - Añade la cabecera `Authorization: Bearer <token>` a las peticiones que van
 *   a nuestra API (y solo a esas, para no enviar el token a otros servidores).
 * - Si la API responde 401 con un token puesto, el token ha caducado o no es
 *   válido, así que cierra la sesión.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.token();
  const peticion =
    token && req.url.includes('/api/')
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(peticion).pipe(
    catchError((err) => {
      // Un 401 en login/registro es "credenciales inválidas", no una sesión caducada
      if (err instanceof HttpErrorResponse && err.status === 401 && !req.url.includes('/auth/')) {
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};