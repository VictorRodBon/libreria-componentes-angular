import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { LoginRespuesta, RegistroRespuesta, Usuario } from '../models/auth.model';

// Usa la misma base que ComponenteService (con proxy: '/api/auth'; sin proxy: 'http://localhost:PUERTO/api/auth')
const API = '/api/auth';
const CLAVE_TOKEN = 'auth_token';
const CLAVE_USUARIO = 'auth_usuario';

/**
 * Gestiona la sesión del usuario: registro, login y logout.
 *
 * El token y el usuario se guardan en localStorage para que la sesión
 * sobreviva al recargar la página, y se exponen como signals para que la
 * interfaz reaccione sola cuando cambian.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _token = signal<string | null>(null);
  private readonly _usuario = signal<Usuario | null>(null);

  readonly token = this._token.asReadonly();
  readonly usuario = this._usuario.asReadonly();
  readonly estaAutenticado = computed(() => this._token() !== null);

  constructor() {
    this.restaurarSesion();
  }

  registro(nombre: string, email: string, password: string) {
    return this.http.post<RegistroRespuesta>(`${API}/register`, { nombre, email, password });
  }

  login(email: string, password: string) {
    return this.http
      .post<LoginRespuesta>(`${API}/login`, { email, password })
      .pipe(tap((respuesta) => this.guardarSesion(respuesta.token, respuesta.data)));
  }

  /** Cierra la sesión: borra token y usuario de memoria y de localStorage. */
  logout(): void {
    this._token.set(null);
    this._usuario.set(null);
    try {
      localStorage.removeItem(CLAVE_TOKEN);
      localStorage.removeItem(CLAVE_USUARIO);
    } catch {
      // Sin acceso a localStorage: la sesión en memoria ya está cerrada.
    }
  }

  private guardarSesion(token: string, usuario: Usuario): void {
    this._token.set(token);
    this._usuario.set(usuario);
    try {
      localStorage.setItem(CLAVE_TOKEN, token);
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    } catch {
      // Sin acceso a localStorage: la sesión dura hasta recargar la página.
    }
  }

  private restaurarSesion(): void {
    try {
      const token = localStorage.getItem(CLAVE_TOKEN);
      const usuario = localStorage.getItem(CLAVE_USUARIO);
      if (token && usuario && !this.tokenCaducado(token)) {
        this._token.set(token);
        this._usuario.set(JSON.parse(usuario) as Usuario);
      } else {
        this.logout();
      }
    } catch {
      this.logout();
    }
  }

  private tokenCaducado(token: string): boolean {
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const { exp } = JSON.parse(atob(payload)) as { exp?: number };
      return !exp || exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}

/** Convierte un error HTTP del backend en un mensaje para mostrar al usuario. */
export function mensajeError(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return 'No se puede conectar con el servidor.';
    if (typeof err.error?.error === 'string') return err.error.error;
    if (err.status === 400) return 'Revisa los datos del formulario.';
  }
  return 'Ha ocurrido un error. Inténtalo de nuevo.';
}