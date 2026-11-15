import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { Favorito } from '../../../core/models/favorito.model';
import { CatalogService } from '../../../core/services/catalog.service';
import { FavService } from '../../../core/services/fav.service';
import { CardComponente } from '../card-componente/card-componente';

@Component({
  imports: [CardComponente],
  selector: 'app-favoritos',
  styleUrl: './favoritos.css',
  templateUrl: './favoritos.html',
})
export class Favoritos {
  private readonly catalogo = inject(CatalogService);
  private readonly fav = inject(FavService);

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

  /** Los que siguen marcados: al quitar un corazón, la tarjeta desaparece. */
  readonly visibles = computed(() =>
    this.favoritos().filter((f) => this.fav.esFavorito(f.id)),
  );
}