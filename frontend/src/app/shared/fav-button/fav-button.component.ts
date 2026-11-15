import { Component, computed, inject, input } from '@angular/core';
import { FavService } from '../../core/services/fav.service';

@Component({
  selector: 'app-fav-button',
  template: `
    <button
      type="button"
      [class.is-on]="activo()"
      [attr.aria-pressed]="activo()"
      [attr.aria-label]="activo() ? 'Quitar de favoritos' : 'Añadir a favoritos'"
      (click)="pulsar($event)"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 4.5 6.4 4.5c2.1 0 3.8 1.2 5.6 3.3 1.8-2.1 3.5-3.3 5.6-3.3 3.7 0 5.5 3.9 4 7.3C19.5 16.4 12 21 12 21z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linejoin="round"
          [attr.fill]="activo() ? 'currentColor' : 'none'"
        />
      </svg>
    </button>
  `,
  styles: `
    :host {
      display: block;
      line-height: 0;
    }
    button {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: none;
      color: var(--text-2);
      cursor: pointer;
      transition:
        color 0.15s,
        transform 0.15s;
    }
    button:hover {
      color: var(--accent);
      transform: scale(1.1);
    }
    button.is-on {
      color: var(--accent);
    }
    button:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
  `,
})
export class FavButtonComponent {
  readonly componenteId = input.required<number>();

  private readonly fav = inject(FavService);
  protected readonly activo = computed(() => this.fav.esFavorito(this.componenteId()));

  protected pulsar(evento: Event): void {
    evento.preventDefault();
    evento.stopPropagation();
    this.fav.alternar(this.componenteId());
  }
}