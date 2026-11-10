import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../button.component';

/**
 * Segunda demo del mismo componente.
 * Demuestra que un componente puede tener varios ejemplos.
 */
@Component({
  selector: 'app-button-secondary-demo',
  imports: [ButtonComponent],
  template: `
    <div class="demo">
      <app-button color="secondary" [disabled]="disabled()">
        Cancelar
      </app-button>

      <label>
        <input
          type="checkbox"
          [checked]="disabled()"
          (change)="disabled.set($any($event.target).checked)">
        Deshabilitado
      </label>
    </div>
  `,
  styles: `
    .demo {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }
  `,
})
export class ButtonSecondaryDemo {
  readonly disabled = signal(false);
}
