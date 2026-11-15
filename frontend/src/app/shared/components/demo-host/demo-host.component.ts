import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  OnChanges,
  Type,
  inject,
  input,
  signal,
} from '@angular/core';
import { DemoRegistry } from '../../../core/services/demo-registry.service';

/**
 * Recibe un demo_key, resuelve la demo en el registro y la instancia
 * dinámicamente con NgComponentOutlet.
 */
@Component({
  selector: 'app-demo-host',
  imports: [NgComponentOutlet],
  templateUrl: `./demo-host.html`,
  styleUrl: `./demo-host.css`,
})
export class DemoHostComponent implements OnChanges {
  readonly demoKey = input.required<string>();

  private readonly registry = inject(DemoRegistry);

  readonly component = signal<Type<unknown> | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  /** Cada vez que cambia el demoKey, carga la demo correspondiente. */
  ngOnChanges(): void {
    void this.load(this.demoKey());
  }

  /** Busca la demo en el registro; si no existe, guarda el mensaje de error para mostrarlo. */
  private async load(key: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    this.component.set(null);

    try {
      this.component.set(await this.registry.load(key));
    } catch (error) {
      this.error.set(
        error instanceof Error ? error.message : 'Demo no disponible',
      );
    } finally {
      this.loading.set(false);
    }
  }
}