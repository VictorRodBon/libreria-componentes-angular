import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  OnChanges,
  Type,
  inject,
  input,
  signal,
} from '@angular/core';
import { DemoRegistry } from '../../core/services/demo-registry.service';

/**
 * Recibe un demo_key, resuelve la demo en el registro y la instancia
 * dinámicamente con NgComponentOutlet.
 */
@Component({
  selector: 'app-demo-host',
  imports: [NgComponentOutlet],
  template: `
    <div class="demo-host">
      @if (loading()) {
        <p class="estado">Cargando demo…</p>
      } @else if (error()) {
        <p class="estado error">{{ error() }}</p>
      } @else {
        @if (component(); as comp) {
          <ng-container [ngComponentOutlet]="comp"></ng-container>
        }
      }
    </div>
  `,
  styles: `
    .demo-host {
      min-height: 4rem;
    }
    .estado {
      margin: 0;
      padding: 20px;
      border: 1px dashed var(--border-strong, #2b3833);
      border-radius: 12px;
      color: var(--text-2, #8b9a95);
      font-size: 0.9375rem;
    }
    .error {
      border-style: solid;
      border-color: rgba(255, 122, 122, 0.35);
      background: rgba(255, 122, 122, 0.08);
      color: #ff7a7a;
    }
  `,
})
export class DemoHostComponent implements OnChanges {
  readonly demoKey = input.required<string>();

  private readonly registry = inject(DemoRegistry);

  readonly component = signal<Type<unknown> | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnChanges(): void {
    void this.load(this.demoKey());
  }

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