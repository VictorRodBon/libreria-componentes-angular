import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { AlertComponent, AlertType } from '../alert.component';

const TIPOS: AlertType[] = ['info', 'success', 'warning', 'danger'];

/**
 * Demo del ejemplo "alert-success": una alerta con controles para cambiar
 * su tipo y si se puede cerrar. Cuenta las veces que se emite `dismissed`.
 */
@Component({
  selector: 'app-alert-success-demo',
  imports: [AlertComponent, ButtonComponent],
  templateUrl: './alert-success.demo.html',
  styleUrl: './alert-success.demo.css',
})
export class AlertSuccessDemo {
  readonly tipos = TIPOS;

  readonly type = signal<AlertType>('success');
  readonly cerrable = signal(true);
  /** La alerta se quita del todo al cerrarla, para poder volver a mostrarla. */
  readonly mostrada = signal(true);
  readonly cierres = signal(0);

  asType(value: string): AlertType {
    return TIPOS.find((t) => t === value) ?? 'info';
  }

  alCerrar(): void {
    this.cierres.update((n) => n + 1);
    this.mostrada.set(false);
  }
}
