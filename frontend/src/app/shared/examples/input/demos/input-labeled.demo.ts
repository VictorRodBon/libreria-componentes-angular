import { Component, signal, viewChild } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { InputComponent } from '../input.component';

/**
 * Demo del ejemplo "input-labeled": un campo enlazado con [(value)],
 * opciones para marcarlo como obligatorio o desactivarlo, y un botón que
 * llama al método clear().
 */
@Component({
  selector: 'app-input-labeled-demo',
  imports: [InputComponent, ButtonComponent],
  templateUrl: './input-labeled.demo.html',
  styleUrl: './input-labeled.demo.css',
})
export class InputLabeledDemo {
  readonly nombre = signal('');
  readonly obligatorio = signal(true);
  readonly desactivado = signal(false);
  readonly enviado = signal('');

  private readonly campo = viewChild.required(InputComponent);

  vaciar(): void {
    this.campo().clear();
  }
}
