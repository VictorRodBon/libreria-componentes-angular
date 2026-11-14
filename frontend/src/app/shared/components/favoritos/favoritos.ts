import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { Favorito } from '../../../core/models/favorito.model';
import { CatalogService } from '../../../core/services/catalog.service';
import { CardComponente } from '../card-componente/card-componente';

@Component({
  imports: [CardComponente],
  selector: 'app-favoritos',
  styleUrl: './favoritos.css',
  templateUrl: './favoritos.html',
})
export class Favoritos {
  private readonly catalogo = inject(CatalogService);

  /**
   * GET /api/favoritos
   * El interceptor añade el Bearer token y el backend resuelve el usuario
   * a partir del JWT, por eso no se envía ningún id desde aquí.
   */
  readonly favoritos = toSignal(
    this.catalogo
      .getFavoritos()
      .pipe(catchError(() => of([] as Favorito[]))),
    { initialValue: [] as Favorito[] },
  );
}
