import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { ApiResponse } from '../models/api-response.model';
import { CategoriaConComponentes } from '../models/catalogo.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);

  /** Todas las categorías con sus componentes y ejemplos. */
  getCatalogo(): Observable<CategoriaConComponentes[]> {
    return this.http
      .get<ApiResponse<CategoriaConComponentes[]>>(`${API_URL}/componentes/catalogo`)
      .pipe(map((res) => res.data));
  }

  /** Una categoría concreta por su slug (por ejemplo 'form-controls'). */
  getCategoria(slug: string): Observable<CategoriaConComponentes> {
    return this.http
      .get<ApiResponse<CategoriaConComponentes>>(`${API_URL}/componentes/catalogo/${slug}`)
      .pipe(map((res) => res.data));
  }
}