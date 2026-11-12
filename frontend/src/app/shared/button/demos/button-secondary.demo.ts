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
      <div class="stage">
        <app-button color="secondary" [disabled]="disabled()">
          Cancelar
        </app-button>
      </div>

      <div class="controls">
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
    input[type='checkbox'] {
      width: 16px;
      height: 16px;
      margin: 0;
      accent-color: var(--accent);
    }
  `,
})
export class ButtonSecondaryDemo {
  readonly disabled = signal(false);
}