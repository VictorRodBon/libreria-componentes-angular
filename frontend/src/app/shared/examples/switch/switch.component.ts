import { Component, input, model, output } from '@angular/core';

/**
 * Interruptor para activar o desactivar una opción.
 *
 * Propiedades (inputs):
 * - `label`: texto junto al interruptor. Por defecto, vacío.
 * - `disabled`: desactiva el interruptor. Por defecto, false.
 * - `size`: sm o md. Por defecto, md.
 *
 * Valor con doble enlace (model):
 * - `checked`: si está activado. Se usa como [(checked)]="variable". Por defecto, false.
 *
 * Evento (output):
 * - `changed`: se emite con el nuevo estado al pulsarlo.
 *
 * Método:
 * - `toggle()`: invierte el estado y emite `changed`.
 */
@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css',
})
export class SwitchComponent {
  readonly label = input('');
  readonly disabled = input(false);
  readonly size = input<'sm' | 'md'>('md');

  readonly checked = model(false);

  /** Se emite con el nuevo estado (true = activado). */
  readonly changed = output<boolean>();

  /** Invierte el estado. No hace nada si el interruptor está desactivado. */
  toggle(): void {
    if (this.disabled()) {
      return;
    }
    this.checked.set(!this.checked());
    this.changed.emit(this.checked());
  }
}
