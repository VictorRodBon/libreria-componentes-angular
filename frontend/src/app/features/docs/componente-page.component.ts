import { Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';
import { DemoHostComponent } from '../../shared/components/demo-host/demo-host.component';
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
  imports: [DemoHostComponent, CodeBlockComponent, BtnAtras],
  templateUrl: `./componente-page.html`,
  styleUrl: `./componente-page.css`,
})
export class ComponentePageComponent {
  readonly selector = input.required<string>();

  private readonly componenteService = inject(ComponenteService);
  readonly componente = signal<Componente | null>(null);

  /** Pestaña activa (HTML / TypeScript / CSS) de cada ejemplo, por posición. */
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
    let codigo:string = "";
    
    if(this.tabDe(indice)==="html"){
      return ejemplo.codigo_html;
    }else if(this.tabDe(indice)==="ts"){
      return ejemplo.codigo_ts;
    }else{
      return ejemplo.codigo_css;
    }
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