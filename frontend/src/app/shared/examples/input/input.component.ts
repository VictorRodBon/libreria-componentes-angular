import { Component, input, model, output } from '@angular/core';

let siguienteId = 0;

/**
 * Campo de texto con etiqueta.
 *
 * Propiedades (inputs):
 * - `label`: texto de la etiqueta. Por defecto, vacío (sin etiqueta).
 * - `placeholder`: texto de ayuda dentro del campo. Por defecto, vacío.
 * - `type`: text, email o password. Por defecto, text.
 * - `required`: marca el campo como obligatorio. Por defecto, false.
 * - `disabled`: desactiva el campo. Por defecto, false.
 *
 * Valor con doble enlace (model):
 * - `value`: texto escrito. Se usa como [(value)]="variable". Por defecto, vacío.
 *
 * Eventos (outputs):
 * - `valueChange`: lo crea `model()` y se emite en cada cambio.
 * - `submitted`: se emite con el texto al pulsar Enter.
 *
 * Método:
 * - `clear()`: vacía el campo.
 */
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {
  readonly label = input('');
  readonly placeholder = input('');
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly required = input(false);
  readonly disabled = input(false);

  readonly value = model('');

  /** Se emite con el texto actual cuando el usuario pulsa Enter. */
  readonly submitted = output<string>();

  /** Id único para enlazar la etiqueta con su campo. */
  readonly id = `app-input-${siguienteId++}`;

  alEscribir(texto: string): void {
    this.value.set(texto);
  }

  alPulsarEnter(): void {
    this.submitted.emit(this.value());
  }

  /** Vacía el campo y avisa del cambio a través de `valueChange`. */
  clear(): void {
    this.value.set('');
  }
}
