import { Component, signal } from '@angular/core';
import { ButtonComponent } from './button.component';

/**
 * Demo interactiva del ejemplo "button-primary".
 * Es un componente Angular normal que usa el componente real
 * y le conecta controles para cambiar sus inputs en vivo.
 */
@Component({
  selector: 'app-button-primary-demo',
  imports: [ButtonComponent],
  template: `
    <div class="demo">
      <app-button [color]="color()" [disabled]="disabled()">
        Guardar
      </app-button>

      <div class="controls">
        <label>
          Color:
          <select
            [value]="color()"
            (change)="color.set(asColor($any($event.target).value))">
            <option value="primary">primary</option>
            <option value="secondary">secondary</option>
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            [checked]="disabled()"
            (change)="disabled.set($any($event.target).checked)">
          Deshabilitado
        </label>
      </div>
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
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
    }
  `,
})
export class ButtonPrimaryDemo {
  readonly color = signal<'primary' | 'secondary'>('primary');
  readonly disabled = signal(false);

  asColor(value: string): 'primary' | 'secondary' {
    return value === 'secondary' ? 'secondary' : 'primary';
  }
}
