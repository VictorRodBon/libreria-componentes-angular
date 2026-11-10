import { Component, input } from '@angular/core';

/**
 * Muestra código como texto.
 * El HTML de la BD NUNCA se ejecuta: solo se pinta.
 */
@Component({
  selector: 'app-code-block',
  template: `<pre><code>{{ code() }}</code></pre>`,
  styles: `
    pre {
      margin: 0.5rem 0 1rem;
      padding: 1rem;
      overflow: auto;
      border-radius: 0.5rem;
      background: #0f172a;
      color: #e2e8f0;
      font-size: 0.875rem;
    }
  `,
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
}
