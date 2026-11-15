import { Component, computed, inject, input } from '@angular/core';
import { FavService } from '../../../core/services/fav.service';

@Component({
  selector: 'app-fav-button',
  templateUrl: `./fav-button.html`,
  styleUrl: './fav-button.css',
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