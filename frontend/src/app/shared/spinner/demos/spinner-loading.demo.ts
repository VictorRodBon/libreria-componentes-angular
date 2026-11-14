import { Component, signal } from '@angular/core';
import { SpinnerColor, SpinnerComponent, SpinnerSize } from '../spinner.component';

const TAMANOS: SpinnerSize[] = ['sm', 'md', 'lg'];
const COLORES: SpinnerColor[] = ['primary', 'neutral', 'danger'];

/**
 * Demo del ejemplo "spinner-loading": un indicador de carga con controles
 * para cambiar su tamaño y su color en vivo.
 */
@Component({
  selector: 'app-spinner-loading-demo',
  imports: [SpinnerComponent],
  templateUrl: './spinner-loading.demo.html',
  styleUrl: './spinner-loading.demo.css',
})
export class SpinnerLoadingDemo {
  readonly tamanos = TAMANOS;
  readonly colores = COLORES;

  readonly size = signal<SpinnerSize>('lg');
  readonly color = signal<SpinnerColor>('primary');

  asSize(value: string): SpinnerSize {
    return TAMANOS.find((t) => t === value) ?? 'md';
  }

  asColor(value: string): SpinnerColor {
    return COLORES.find((c) => c === value) ?? 'primary';
  }
}
