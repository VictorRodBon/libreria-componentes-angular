import { Component, input } from '@angular/core';

/**
 * Tarjeta para agrupar contenido.
 *
 * - `titulo` y `subtitulo` (opcionales) forman la cabecera.
 * - El contenido normal va en el cuerpo.
 * - Lo que lleve el atributo `footer` se proyecta en el pie:
 *   <div footer>…</div>
 */
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  readonly titulo = input('');
  readonly subtitulo = input('');
}
