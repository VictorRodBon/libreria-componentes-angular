import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { CheckboxComponent } from '../checkbox.component';

/**
 * Demo del ejemplo "checkbox-acceptance": una casilla de aceptación enlazada
 * con [(checked)] que activa o desactiva un botón, y un contador del
 * evento changed.
 */
@Component({
  selector: 'app-checkbox-acceptance-demo',
  imports: [CheckboxComponent, ButtonComponent],
  templateUrl: './checkbox-acceptance.demo.html',
  styleUrl: './checkbox-acceptance.demo.css',
})
export class CheckboxAcceptanceDemo {
  readonly aceptado = signal(false);
  readonly desactivado = signal(false);
  readonly cambios = signal(0);

  alCambiar(): void {
    this.cambios.update((n) => n + 1);
  }
}
