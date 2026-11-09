import { Component, input } from '@angular/core';

/**
 * Componente real de la librería.
 * No sabe nada de demos: solo expone sus inputs.
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
      padding: 0.5rem 1rem;
      border: 0;
      border-radius: 0.375rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-primary {
      background: #2563eb;
      color: #fff;
    }
    .btn-secondary {
      background: #e5e7eb;
      color: #111827;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
})
export class ButtonComponent {
  readonly color = input<'primary' | 'secondary'>('primary');
  readonly disabled = input(false);
}
