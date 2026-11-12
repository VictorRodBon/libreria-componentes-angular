import { Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { CodeBlockComponent } from '../../shared/code-block/code-block.component';
import { DemoHostComponent } from '../../shared/demo-host/demo-host.component';
import { Componente } from '../../core/models/componente.model';
import { ComponenteService } from '../../core/services/componente.service';

type Lenguaje = 'html' | 'ts';

/**
 * Página de detalle de un componente.
 *
 * Recibe el selector por la ruta:
 *   /docs/form-controls/app-button
 *
 * Con withComponentInputBinding() el parámetro :selector llega al input().
 *
 * Los colores, fuentes y radios salen de las variables CSS de src/styles.css.
 */
@Component({
  selector: 'app-componente-page',
  imports: [DemoHostComponent, CodeBlockComponent],
  template: `
    @if (componente(); as comp) {
      <header class="page-header">
        <p class="categoria">{{ comp.categoria.nombre }}</p>
        <h1>{{ comp.nombre }}</h1>
        <p class="descripcion">{{ comp.descripcion }}</p>
        <code class="selector">{{ comp.selector }}</code>
      </header>

      <section>
        <h2>Ejemplos</h2>

        @for (ejemplo of comp.ejemplos; track ejemplo.id; let i = $index) {
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

              <div class="code">
                <div class="code__bar">
                  <div class="code__tabs" role="tablist">
                    <button
                      type="button"
                      role="tab"
                      [attr.aria-selected]="tabDe(i) === 'html'"
                      [class.is-on]="tabDe(i) === 'html'"
                      (click)="elegirTab(i, 'html')"
                    >
                      HTML
                    </button>
                    <button
                      type="button"
                      role="tab"
                      [attr.aria-selected]="tabDe(i) === 'ts'"
                      [class.is-on]="tabDe(i) === 'ts'"
                      (click)="elegirTab(i, 'ts')"
                    >
                      TypeScript
                    </button>
                  </div>
                  <button
                    type="button"
                    class="code__copy"
                    (click)="copiar(i, codigoDe(ejemplo, i))"
                  >
                    {{ copiado() === i ? 'Copiado' : 'Copiar' }}
                  </button>
                </div>
                <app-code-block [code]="codigoDe(ejemplo, i)"></app-code-block>
              </div>
            </details>
          </article>
        } @empty {
          <p class="vacio">Este componente todavía no tiene ejemplos.</p>
        }
      </section>
    } @else {
      <p class="vacio">Cargando componente…</p>
    }
  `,
  styles: `
    :host {
      display: block;
      max-width: 780px;
      margin: 0 auto;
      padding: clamp(40px, 8vw, 88px) clamp(16px, 4vw, 32px) 96px;
    }

    /* ---------- Cabecera ---------- */
    .page-header {
      margin-bottom: 56px;
    }
    .categoria {
      margin: 0 0 12px;
      color: var(--accent);
      font-size: 0.9375rem;
      font-weight: 500;
    }
    h1 {
      margin: 0 0 16px;
      font-size: clamp(2.25rem, 5vw, 3rem);
      font-weight: 500;
      line-height: 1.05;
      letter-spacing: -0.035em;
    }
    .descripcion {
      max-width: 60ch;
      margin: 0 0 20px;
      color: var(--text-2);
      font-size: 1.125rem;
    }
    .selector {
      display: inline-block;
      padding: 2px 8px;
      border: 1px solid var(--border-strong);
      border-radius: 6px;
      background: var(--surface-2);
      color: var(--text-2);
      font: 400 0.8125rem/1.6 var(--font-mono);
    }

    /* ---------- Ejemplos ---------- */
    h2 {
      margin: 0 0 32px;
      font-size: 1.5rem;
      font-weight: 500;
      letter-spacing: -0.02em;
    }
    .ejemplo + .ejemplo {
      margin-top: 56px;
    }
    h3 {
      margin: 0 0 16px;
      font-size: 1.125rem;
      font-weight: 500;
    }
    .sin-demo,
    .vacio {
      margin: 0;
      color: var(--text-2);
    }
    .sin-demo {
      padding: 20px;
      border: 1px dashed var(--border-strong);
      border-radius: 12px;
    }

    /* ---------- Ver código ---------- */
    details {
      margin-top: 8px;
    }
    summary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      color: var(--text-2);
      font-size: 0.875rem;
      cursor: pointer;
      list-style: none;
    }
    summary::-webkit-details-marker {
      display: none;
    }
    summary::before {
      content: '';
      width: 6px;
      height: 6px;
      border-right: 1.5px solid currentColor;
      border-bottom: 1.5px solid currentColor;
      transform: rotate(-45deg);
      transition: transform 0.15s;
    }
    details[open] > summary::before {
      transform: rotate(45deg);
    }
    summary:hover {
      color: var(--text);
    }

    .code {
      overflow: hidden;
      margin-top: 8px;
      border: 1px solid var(--border-strong);
      border-radius: 12px;
      background: var(--surface);
    }
    .code__bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 12px;
      border-bottom: 1px solid var(--border);
    }
    .code__tabs {
      display: flex;
      gap: 4px;
    }
    .code__tabs button {
      margin-bottom: -1px;
      padding: 11px 10px;
      border: 0;
      border-bottom: 2px solid transparent;
      background: none;
      color: var(--text-2);
      font-size: 0.8125rem;
      cursor: pointer;
    }
    .code__tabs button:hover {
      color: var(--text);
    }
    .code__tabs button.is-on {
      color: var(--accent);
      border-bottom-color: var(--accent);
    }
    .code__copy {
      margin-left: auto;
      padding: 4px 10px;
      border: 1px solid var(--border-strong);
      border-radius: 6px;
      background: none;
      color: var(--text-2);
      font-size: 0.8125rem;
      cursor: pointer;
    }
    .code__copy:hover {
      color: var(--text);
    }

    /* El bloque de código va dentro de .code, que ya pone el borde y el radio */
    app-code-block {
      --code-border: 0;
      --code-radius: 0;
    }
  `,
})
export class ComponentePageComponent {
  readonly selector = input.required<string>();

  private readonly componenteService = inject(ComponenteService);
  readonly componente = signal<Componente | null>(null);

  /** Pestaña activa (HTML / TypeScript) de cada ejemplo, por posición. */
  private readonly tabs = signal<Record<number, Lenguaje>>({});
  /** Posición del ejemplo cuyo código se acaba de copiar. */
  readonly copiado = signal<number | null>(null);

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

  tabDe(indice: number): Lenguaje {
    return this.tabs()[indice] ?? 'html';
  }

  elegirTab(indice: number, lenguaje: Lenguaje): void {
    this.tabs.update((t) => ({ ...t, [indice]: lenguaje }));
  }

  codigoDe(ejemplo: Componente['ejemplos'][number], indice: number) {
    return this.tabDe(indice) === 'html' ? ejemplo.codigo_html : ejemplo.codigo_ts;
  }

  async copiar(indice: number, codigo: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(codigo);
      this.copiado.set(indice);
      setTimeout(() => this.copiado.update((c) => (c === indice ? null : c)), 1600);
    } catch {
      // Sin permiso de portapapeles: no hacemos nada.
    }
  }
}