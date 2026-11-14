import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../api.config';
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
  const token = auth.token;

  const peticion =
    token && req.url.startsWith(API_URL)
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && token) {
        auth.logout();
      }
      return throwError(() => error);
    }),
  );
};