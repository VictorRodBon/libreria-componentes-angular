import { Component, input } from '@angular/core';

/**
 * Muestra código como texto.
 * El HTML de la BD NUNCA se ejecuta: solo se pinta.
 *
 * Por defecto tiene borde y esquinas redondeadas. Si se coloca dentro de otro
 * contenedor que ya los pone, se pueden quitar con --code-border y --code-radius.
 */
@Component({
  selector: 'app-code-block',
  template: `<pre tabindex="0"><code>{{ code() }}</code></pre>`,
  styles: `
    :host {
      display: block;
    }
    pre {
      margin: 0;
      padding: 16px 18px;
      overflow: auto;
      border: var(--code-border, 1px solid var(--border-strong, #2b3833));
      border-radius: var(--code-radius, 12px);
      background: var(--surface, #101614);
      color: var(--text, #eaf1ee);
      font: 400 0.84375rem/1.7 var(--font-mono, ui-monospace, Consolas, monospace);
      tab-size: 2;
    }
    code {
      font: inherit;
    }
  `,
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
}