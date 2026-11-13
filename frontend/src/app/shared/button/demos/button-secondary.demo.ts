import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../button.component';

/**
 * Segunda demo del mismo componente.
 * Demuestra que un componente puede tener varios ejemplos.
 */
@Component({
  selector: 'app-button-secondary-demo',
  imports: [ButtonComponent],
  templateUrl: './button-secondary.demo.html',
  styleUrl: './button-secondary.demo.css',
})
export class ButtonSecondaryDemo {
  readonly disabled = signal(false);
}
