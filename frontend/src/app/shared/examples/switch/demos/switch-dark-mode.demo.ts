import { Component, signal } from '@angular/core';
import { SwitchComponent } from '../switch.component';

/**
 * Demo del ejemplo "switch-dark-mode": un interruptor enlazado con
 * [(checked)] que cambia el aspecto de una tarjeta de vista previa.
 */
@Component({
  selector: 'app-switch-dark-mode-demo',
  imports: [SwitchComponent],
  templateUrl: './switch-dark-mode.demo.html',
  styleUrl: './switch-dark-mode.demo.css',
})
export class SwitchDarkModeDemo {
  readonly modoOscuro = signal(true);
  readonly tamano = signal<'sm' | 'md'>('md');
  readonly desactivado = signal(false);
  readonly ultimoCambio = signal('ninguno');

  alCambiar(activo: boolean): void {
    this.ultimoCambio.set(activo ? 'activado' : 'desactivado');
  }
}
