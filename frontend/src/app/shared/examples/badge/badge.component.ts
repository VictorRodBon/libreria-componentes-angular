import { Component, input } from '@angular/core';

export type BadgeColor = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeVariant = 'subtle' | 'solid' | 'outline';

/**
 * Etiqueta compacta para estados o contadores.
 *
 * - `color`: neutral, success, warning, danger o info.
 * - `variant`: subtle (fondo suave), solid (relleno) u outline (solo borde).
 * El texto se escribe dentro: <app-badge>Activo</app-badge>
 */
@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css',
})
export class BadgeComponent {
  readonly color = input<BadgeColor>('neutral');
  readonly variant = input<BadgeVariant>('subtle');
}
