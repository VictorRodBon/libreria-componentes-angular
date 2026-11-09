import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Componente } from './componente.model';
import { MOCK_COMPONENTE } from './mock-componente';

@Injectable({ providedIn: 'root' })
export class ComponenteService {
  /**
   * Versión de ejemplo sin backend.
   *
   * En la app real, sustituye este método por:
   *
   * private readonly http = inject(HttpClient);
   * private readonly api = 'http://localhost:3000/api';
   *
   * getComponente(selector: string): Observable<Componente> {
   *   return this.http.get<Componente>(`${this.api}/componentes/${selector}`);
   * }
   */
  getComponente(selector: string): Observable<Componente> {
    return of({ ...MOCK_COMPONENTE, selector });
  }
}
