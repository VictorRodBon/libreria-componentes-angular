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
  template: `
    <div class="demo">
      <div class="stage">
        <app-button [color]="color()" [disabled]="disabled()">
          Guardar
        </app-button>
      </div>

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
      overflow: hidden;
      border: 1px solid var(--border-strong);
      border-radius: 12px;
      background: var(--surface);
    }
    .stage {
      display: grid;
      place-items: center;
      min-height: 160px;
      padding: 32px 16px;
      background-image: radial-gradient(var(--border-strong) 1px, transparent 1px);
      background-size: 16px 16px;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 24px;
      align-items: center;
      padding: 12px 16px;
      border-top: 1px solid var(--border);
      color: var(--text-2);
      font-size: 0.875rem;
    }
    label {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    select {
      height: 32px;
      padding: 0 10px;
      border: 1px solid var(--border-strong);
      border-radius: 6px;
      background: var(--surface-2);
      color: var(--text);
      font: inherit;
      font-size: 0.875rem;
    }
    input[type='checkbox'] {
      width: 16px;
      height: 16px;
      margin: 0;
      accent-color: var(--accent);
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