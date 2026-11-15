import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FavService } from '../../core/services/fav.service';

@Component({
  selector: 'app-login-modal',
  imports: [RouterLink],
  template: `
    <dialog
      #dialogo
      aria-labelledby="modal-titulo"
      (close)="fav.cerrarAviso()"
      (click)="clicFuera($event)"
    >
      <div class="contenido">
        <h2 id="modal-titulo">Inicia sesión para guardar favoritos</h2>
        <p>Necesitas una cuenta para marcar componentes como favoritos.</p>
        <div class="acciones">
          <button type="button" (click)="fav.cerrarAviso()">Cancelar</button>
          <a routerLink="/registro" (click)="fav.cerrarAviso()">Registrarse</a>
          <a
            routerLink="/login"
            class="primario"
            [queryParams]="{ returnUrl: router.url }"
            (click)="fav.cerrarAviso()"
            >Iniciar sesión</a
          >
        </div>
      </div>
    </dialog>
  `,
  styles: `
    dialog {
      width: calc(100% - 32px);
      max-width: 420px;
      padding: 0;
      border: 1px solid var(--border-strong);
      border-radius: 12px;
      background: var(--surface);
      color: var(--text);
    }
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.45);
    }
    .contenido {
      padding: 24px;
    }
    h2 {
      margin: 0 0 8px;
      font-size: 1.25rem;
      font-weight: 500;
    }
    p {
      margin: 0 0 24px;
      color: var(--text-2);
    }
    .acciones {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
    }
    .acciones button,
    .acciones a {
      padding: 8px 14px;
      border: 1px solid var(--border-strong);
      border-radius: 8px;
      background: none;
      color: var(--text);
      font: inherit;
      font-size: 0.875rem;
      text-decoration: none;
      cursor: pointer;
    }
    .acciones .primario {
      border-color: var(--accent);
      background: var(--accent);
      color: #fff;
    }
  `,
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