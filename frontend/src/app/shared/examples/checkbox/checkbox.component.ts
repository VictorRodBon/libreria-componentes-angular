import { Component, input, model, output } from '@angular/core';

let siguienteId = 0;

/**
 * Casilla de verificación con etiqueta.
 *
 * Propiedades (inputs):
 * - `label`: texto junto a la casilla. Por defecto, vacío.
 * - `disabled`: desactiva la casilla. Por defecto, false.
 *
 * Valor con doble enlace (model):
 * - `checked`: si está marcada. Se usa como [(checked)]="variable". Por defecto, false.
 *
 * Evento (output):
 * - `changed`: se emite con el nuevo estado cada vez que el usuario la marca o desmarca.
 *
 * Método:
 * - `toggle()`: invierte el estado y emite `changed`.
 */
@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
})
export class CheckboxComponent {
  readonly label = input('');
  readonly disabled = input(false);

  readonly checked = model(false);

  /** Se emite con el nuevo estado (true = marcada). */
  readonly changed = output<boolean>();

  readonly id = `app-checkbox-${siguienteId++}`;

  /** Invierte el estado. No hace nada si la casilla está desactivada. */
  toggle(): void {
    if (this.disabled()) {
      return;
    }
    this.checked.set(!this.checked());
    this.changed.emit(this.checked());
  }
}
