import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FavService } from '../../core/services/fav.service';

@Component({
  selector: 'app-login-modal',
  imports: [RouterLink],
  templateUrl: `./login-modal.html`,
  styleUrl: `./login-modal.css`,
})
export class LoginModalComponent {
  protected readonly fav = inject(FavService);
  protected readonly router = inject(Router);

  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');

  constructor() {
    effect(() => {
      const el = this.dialogo().nativeElement;
      if (this.fav.avisoLogin()) {
        if (!el.open) el.showModal();
      } else if (el.open) {
        el.close();
      }
    });
  }

  /** Un clic en el fondo oscuro (fuera del contenido) cierra la ventana. */
  protected clicFuera(evento: MouseEvent): void {
    if (evento.target === this.dialogo().nativeElement) {
      this.fav.cerrarAviso();
    }
  }
}