import { Component, input } from '@angular/core';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerColor = 'primary' | 'neutral' | 'danger';

/**
 * Indicador animado de carga en curso.
 *
 * - `size`: sm, md o lg.
 * - `color`: primary, neutral o danger.
 * - `label`: texto para lectores de pantalla (por defecto "Cargando").
 */
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
})
export class SpinnerComponent {
  readonly size = input<SpinnerSize>('md');
  readonly color = input<SpinnerColor>('primary');
  readonly label = input('Cargando');
}
