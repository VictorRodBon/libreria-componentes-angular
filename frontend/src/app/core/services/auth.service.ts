import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../api.config';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  Usuario,
} from '../models/auth.model';

const TOKEN_KEY = 'auth_token';
const USUARIO_KEY = 'auth_usuario';

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

  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly usuarioSignal = signal<Usuario | null>(this.leerUsuarioGuardado());

  /** Usuario con sesión iniciada, o null si no hay sesión. Solo lectura. */
  readonly usuario = this.usuarioSignal.asReadonly();
  /** true si hay un token guardado. */
  readonly isLoggedIn = computed(() => this.tokenSignal() !== null);

  /** Token actual (lo usa el interceptor), o null si no hay sesión. */
  get token(): string | null {
    return this.tokenSignal();
  }

  /** Crea una cuenta. No inicia sesión: después hay que llamar a login(). */
  register(datos: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${API_URL}/auth/register`, datos);
  }

  /** Inicia sesión y, si las credenciales son correctas, guarda token y usuario. */
  login(datos: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, datos).pipe(
      tap((res) => this.guardarSesion(res.token, res.data)),
    );
  }

  /** Cierra la sesión: borra token y usuario de memoria y de localStorage. */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    this.tokenSignal.set(null);
    this.usuarioSignal.set(null);
  }

  private guardarSesion(token: string, usuario: Usuario): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
    this.tokenSignal.set(token);
    this.usuarioSignal.set(usuario);
  }

  private leerUsuarioGuardado(): Usuario | null {
    const guardado = localStorage.getItem(USUARIO_KEY);
    return guardado ? (JSON.parse(guardado) as Usuario) : null;
  }
}