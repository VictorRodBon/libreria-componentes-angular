import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Favorito } from '../models/favorito.model';
import { AuthService } from './auth.service';
import { CatalogService } from './catalog.service';

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

  esFavorito(componenteId: number): boolean {
    return this._ids().has(componenteId);
  }

  cerrarAviso(): void {
    this._avisoLogin.set(false);
  }

  getFavorito(): Observable<Favorito[]> {
    return this.catalogo.getFavoritos();
  }

  addFavorito(componenteId: number) {
    return this.http.post<unknown>(`${API_URL}/favoritos/${componenteId}`, {});
  }

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

  private cargar(): void {
    this.getFavorito().subscribe({
      next: (lista) => this._ids.set(new Set(lista.map((f) => f.id))),
      error: () => {
        // Sin conexión o token caducado: se mantiene la lista actual.
      },
    });
  }

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