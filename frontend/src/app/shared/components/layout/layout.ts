import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CatalogService } from '../../../core/services/catalog.service';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private readonly catalogo = inject(CatalogService);

  readonly categorias = toSignal(this.catalogo.getCategorias(), {
    initialValue: [],
  });
}
