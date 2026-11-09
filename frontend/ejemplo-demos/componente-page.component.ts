import { Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { CodeBlockComponent } from './code-block.component';
import { DemoHostComponent } from './demo-host.component';
import { Componente } from './componente.model';
import { ComponenteService } from './componente.service';

/**
 * Página de detalle de un componente.
 *
 * Recibe el selector por la ruta:
 *   /docs/form-controls/app-button
 *
 * Con withComponentInputBinding() el parámetro :selector llega al input().
 */
@Component({
  selector: 'app-componente-page',
  imports: [DemoHostComponent, CodeBlockComponent],
  template: `
    @if (componente(); as comp) {
      <header class="page-header">
        <p class="categoria">{{ comp.categoria.nombre }}</p>
        <h1>{{ comp.nombre }}</h1>
        <p>{{ comp.descripcion }}</p>
        <code>{{ comp.selector }}</code>
      </header>

      <section>
        <h2>Ejemplos</h2>

        @for (ejemplo of comp.ejemplos; track ejemplo.id) {
          <article class="ejemplo">
            <h3>{{ ejemplo.titulo }}</h3>

            <!-- Demo viva (solo si el ejemplo tiene demo_key) -->
            @if (ejemplo.demo_key) {
              <app-demo-host [demoKey]="ejemplo.demo_key"></app-demo-host>
            } @else {
              <p class="sin-demo">Este ejemplo todavía no tiene demo interactiva.</p>
            }

            <!-- Código de ejemplo (solo texto) -->
            <details>
              <summary>Ver código</summary>
              <h4>HTML</h4>
              <app-code-block [code]="ejemplo.codigo_html"></app-code-block>
              <h4>TypeScript</h4>
              <app-code-block [code]="ejemplo.codigo_ts"></app-code-block>
            </details>
          </article>
        } @empty {
          <p>Este componente todavía no tiene ejemplos.</p>
        }
      </section>
    } @else {
      <p>Cargando componente…</p>
    }
  `,
  styles: `
    .page-header {
      margin-bottom: 2rem;
    }
    .categoria {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
      text-transform: uppercase;
    }
    .ejemplo {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .sin-demo {
      color: #6b7280;
      font-style: italic;
    }
    h4 {
      margin-bottom: 0.25rem;
    }
  `,
})
export class ComponentePageComponent {
  readonly selector = input.required<string>();

  private readonly componenteService = inject(ComponenteService);
  readonly componente = signal<Componente | null>(null);

  constructor() {
    toObservable(this.selector)
      .pipe(
        switchMap((selector) =>
          this.componenteService.getComponente(selector),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((componente) => this.componente.set(componente));
  }
}
