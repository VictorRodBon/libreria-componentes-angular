import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Componente } from '../models/componente.model';

// La API responde { success, data }; aquí se desenvuelve.
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ComponenteService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3000/api';

  getComponente(selector: string): Observable<Componente> {
    return this.http
      .get<ApiResponse<Componente>>(`${this.api}/componentes/${selector}`)
      .pipe(map((res) => res.data));
  }
}
