import { Component, signal } from '@angular/core';
import { BadgeColor, BadgeComponent, BadgeVariant } from '../badge.component';

const COLORES: BadgeColor[] = ['neutral', 'success', 'warning', 'danger', 'info'];
const VARIANTES: BadgeVariant[] = ['subtle', 'solid', 'outline'];

/**
 * Demo del ejemplo "badge-status": una etiqueta de estado con controles
 * para cambiar su color, su variante y su texto en vivo.
 */
@Component({
  selector: 'app-badge-status-demo',
  imports: [BadgeComponent],
  templateUrl: './badge-status.demo.html',
  styleUrl: './badge-status.demo.css',
})
export class BadgeStatusDemo {
  readonly colores = COLORES;
  readonly variantes = VARIANTES;

  readonly color = signal<BadgeColor>('success');
  readonly variant = signal<BadgeVariant>('subtle');
  readonly texto = signal('Activo');

  asColor(value: string): BadgeColor {
    return COLORES.find((c) => c === value) ?? 'neutral';
  }

  asVariant(value: string): BadgeVariant {
    return VARIANTES.find((v) => v === value) ?? 'subtle';
  }
}
