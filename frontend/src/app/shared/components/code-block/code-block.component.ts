import { Component, input } from '@angular/core';

/**
 * Muestra código como texto.
 * El HTML de la BD NUNCA se ejecuta: solo se pinta.
 *
 * Por defecto tiene borde y esquinas redondeadas. Si se coloca dentro de otro
 * contenedor que ya los pone, se pueden quitar con --code-border y --code-radius.
 */
@Component({
  selector: 'app-code-block',
  templateUrl: `./code-block.html`,
  styleUrl: `./code-block.css`,
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
}