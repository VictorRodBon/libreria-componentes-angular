import { Component, input } from '@angular/core';

/**
 * Componente real de la librería.
 * No sabe nada de demos: solo expone sus inputs.
 * Los colores usan las variables de src/styles.css, con valor por defecto
 * por si el componente se usa fuera de este proyecto.
 */
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  readonly color = input<'primary' | 'secondary'>('primary');
  readonly disabled = input(false);
}
