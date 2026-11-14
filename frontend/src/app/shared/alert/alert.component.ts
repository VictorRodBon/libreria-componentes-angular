import { Component, input, output, signal } from '@angular/core';

export type AlertType = 'info' | 'success' | 'warning' | 'danger';

/**
 * Mensaje de estado para informar, advertir o mostrar errores.
 *
 * Propiedades (inputs):
 * - `type`: info, success, warning o danger. Por defecto, info.
 * - `titulo`: texto en negrita encima del mensaje. Por defecto, vacío.
 * - `cerrable`: si es true, muestra un botón para cerrar. Por defecto, false.
 *
 * Evento (output):
 * - `dismissed`: se emite cuando la alerta se cierra.
 *
 * Método:
 * - `close()`: oculta la alerta y emite `dismissed`.
 *
 * El mensaje se escribe dentro: <app-alert>Guardado</app-alert>
 */
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  readonly type = input<AlertType>('info');
  readonly titulo = input('');
  readonly cerrable = input(false);

  /** Se emite una vez, cuando la alerta se cierra. */
  readonly dismissed = output<void>();

  /** Estado interno: si la alerta se está mostrando. */
  readonly visible = signal(true);

  /** Oculta la alerta y avisa al componente padre. No hace nada si ya estaba cerrada. */
  close(): void {
    if (!this.visible()) {
      return;
    }
    this.visible.set(false);
    this.dismissed.emit();
  }
}
