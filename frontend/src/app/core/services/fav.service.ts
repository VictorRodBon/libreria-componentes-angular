import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Favorito } from '../models/favorito.model';
import { AuthService } from './auth.service';
import { CatalogService } from './catalog.service';

/**
 * Gestiona los favoritos del usuario con sesión.
 *
 * Guarda en memoria los ids marcados para que los corazones se pinten al
 * instante, y sincroniza con la API (GET, POST y DELETE /api/favoritos).
 */
@Injectable({ providedIn: 'root' })
export class FavService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly catalogo = inject(CatalogService);

  /** Ids de los componentes favoritos del usuario con sesión. */
  private readonly _ids = signal<ReadonlySet<number>>(new Set());

  /** Si es true, se muestra la ventana que pide iniciar sesión. */
  private readonly _avisoLogin = signal(false);
  readonly avisoLogin = this._avisoLogin.asReadonly();

  constructor() {
    // Con sesión: carga los favoritos. Sin sesión (o al cerrarla): vacía la lista.
    effect(() => {
      if (this.auth.estaAutenticado()) {
        this.cargar();
      } else {
        this._ids.set(new Set());
      }
    });
  }

  /** True si el componente está en favoritos. */
  esFavorito(componenteId: number): boolean {
    return this._ids().has(componenteId);
  }

  /** Cierra la ventana que pide iniciar sesión. */
  cerrarAviso(): void {
    this._avisoLogin.set(false);
  }

  /** Lista completa de favoritos del usuario. */
  getFavorito(): Observable<Favorito[]> {
    return this.catalogo.getFavoritos();
  }

  /** POST /api/favoritos/:componenteId */
  addFavorito(componenteId: number) {
    return this.http.post<unknown>(`${API_URL}/favoritos/${componenteId}`, {});
  }

  /** DELETE /api/favoritos/:componenteId */
  borrarFavorito(componenteId: number) {
    return this.http.delete<unknown>(`${API_URL}/favoritos/${componenteId}`);
  }

  /** Marca o desmarca un favorito. Sin sesión, abre la ventana de inicio de sesión. */
  alternar(componenteId: number): void {
    if (!this.auth.estaAutenticado()) {
      this._avisoLogin.set(true);
      return;
    }

    const eraFavorito = this.esFavorito(componenteId);
    this.marcar(componenteId, !eraFavorito); // cambio inmediato en pantalla

    const peticion = eraFavorito
      ? this.borrarFavorito(componenteId)
      : this.addFavorito(componenteId);

    // Si falla, se vuelve a pedir la lista real para que la pantalla no mienta.
    peticion.subscribe({ error: () => this.cargar() });
  }

  /** Pide a la API los favoritos y actualiza los ids en memoria. */
  private cargar(): void {
    this.getFavorito().subscribe({
      next: (lista) => this._ids.set(new Set(lista.map((f) => f.id))),
      error: () => {
        // Sin conexión o token caducado: se mantiene la lista actual.
      },
    });
  }

  /** Añade o quita un id del conjunto en memoria. */
  private marcar(componenteId: number, activo: boolean): void {
    this._ids.update((ids) => {
      const copia = new Set(ids);
      if (activo) {
        copia.add(componenteId);
      } else {
        copia.delete(componenteId);
      }
      return copia;
    });
  }
}