import { Component, computed, inject, input } from '@angular/core';
import { FavService } from '../../../core/services/fav.service';

/**
 * Botón de corazón para marcar o desmarcar un componente como favorito.
 *
 * Input obligatorio:
 * - `componenteId`: id del componente en la base de datos.
 *
 * Si no hay sesión, en lugar de guardar abre la ventana que pide iniciar sesión.
 */
@Component({
  selector: 'app-fav-button',
  templateUrl: `./fav-button.html`,
  styleUrl: './fav-button.css',
})
export class FavButtonComponent {
  readonly componenteId = input.required<number>();

  private readonly fav = inject(FavService);
  protected readonly activo = computed(() => this.fav.esFavorito(this.componenteId()));

  /** Evita que el clic abra el enlace de la tarjeta y alterna el favorito. */
  protected pulsar(evento: Event): void {
    evento.preventDefault();
    evento.stopPropagation();
    this.fav.alternar(this.componenteId());
  }
}