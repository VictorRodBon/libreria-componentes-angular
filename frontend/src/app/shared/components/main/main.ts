import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { CatalogService } from '../../../core/services/catalog.service';
import { CategoriaConComponentes } from '../../../core/models/catalogo.model';
import { CardComponente } from '../card-componente/card-componente';

/** Página de listado: muestra todo el catálogo o solo una categoría, según la URL. */
@Component({
  imports: [RouterLink, CardComponente],
  selector: 'app-main',
  styleUrl: './main.css',
  templateUrl: './main.html',
})
export class Main {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogo = inject(CatalogService);

  /**
   * Catálogo según la URL:
   *   /                      → todos los componentes
   *   /categoria/:slug       → solo los de esa categoría
   *
   * El parámetro debe llamarse `categoriaSlug` en app.routes.ts.
   */
  readonly categorias = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const slug = params.get('categoriaSlug');

        return (
          slug
            ? this.catalogo.getCategoria(slug).pipe(map((categoria) => [categoria]))
            : this.catalogo.getCatalogo()
        ).pipe(
          // Dentro del switchMap para que un 404 no corte el stream.
          catchError(() => of([] as CategoriaConComponentes[])),
        );
      }),
    ),
    { initialValue: [] as CategoriaConComponentes[] },
  );
}
