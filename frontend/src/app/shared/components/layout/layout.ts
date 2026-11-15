import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CatalogService } from '../../../core/services/catalog.service';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Estructura común de las páginas del catálogo: barra lateral con las
 * categorías (y Favoritos si hay sesión) y, a la derecha, la página activa.
 */
@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private readonly catalogo = inject(CatalogService);
  protected readonly auth = inject(AuthService);

  /** Categorías para el menú lateral, cargadas desde la API. */
  readonly categorias = toSignal(this.catalogo.getCategorias(), {
    initialValue: [],
  });
}
