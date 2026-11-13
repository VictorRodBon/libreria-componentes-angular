import { Component, input } from '@angular/core';

/**
 * Componente real de la librería.
 * No sabe nada de demos: solo expone sus inputs.
 * Los colores usan las variables de src/styles.css, con valor por defecto
 * por si el componente se usa fuera de este proyecto.
 */
@Component({
  selector: 'app-button',
  template: `
    <button
      [class]="'btn btn-' + color()"
      [disabled]="disabled()"
      type="button">
      <ng-content></ng-content>
    </button>
  `,
  styles: `
    .btn {
      height: 40px;
      padding: 0 18px;
      border: 1px solid transparent;
      border-radius: 10px;
      font-family: inherit;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .btn-primary {
      background: var(--accent, #1fe39b);
      color: var(--accent-ink, #04130d);
    }
    .btn-primary:hover:not(:disabled) {
      background: #4cebb0;
    }
    .btn-secondary {
      border-color: var(--border-strong, #2b3833);
      background: var(--surface-2, #151d1a);
      color: var(--text, #eaf1ee);
    }
    .btn-secondary:hover:not(:disabled) {
      border-color: var(--text-2, #8b9a95);
    }
    .btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `,
})
export class ButtonComponent {
  readonly color = input<'primary' | 'secondary'>('primary');
  readonly disabled = input(false);
}