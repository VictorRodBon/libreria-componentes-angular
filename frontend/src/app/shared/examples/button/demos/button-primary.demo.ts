import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../button.component';

/**
 * Demo interactiva del ejemplo "button-primary".
 * Es un componente Angular normal que usa el componente real
 * y le conecta controles para cambiar sus inputs en vivo.
 */
@Component({
  selector: 'app-button-primary-demo',
  imports: [ButtonComponent],
  templateUrl: './button-primary.demo.html',
  styleUrl: './button-primary.demo.css',
})
export class ButtonPrimaryDemo {
  readonly color = signal<'primary' | 'secondary'>('primary');
  readonly disabled = signal(false);

  asColor(value: string): 'primary' | 'secondary' {
    return value === 'secondary' ? 'secondary' : 'primary';
  }
}
