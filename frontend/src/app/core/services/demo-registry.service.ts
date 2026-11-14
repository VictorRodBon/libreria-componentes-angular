import { Injectable, Type } from '@angular/core';

type DemoLoader = () => Promise<Type<unknown>>;

/**
 * Mapa demo_key → import() dinámico.
 *
 * Cada import() genera un chunk independiente: la demo solo se descarga
 * cuando el usuario abre ese ejemplo concreto.
 */
const DEMOS: Record<string, DemoLoader> = {
  'button-primary': () =>
    import('../../shared/button/demos/button-primary.demo').then((m) => m.ButtonPrimaryDemo),
  'button-secondary': () =>
    import('../../shared/button/demos/button-secondary.demo').then((m) => m.ButtonSecondaryDemo),
    'card-basic': () =>
    import('../../shared/card/demos/card-basic.demo').then((m) => m.CardBasicDemo),
      'badge-status': () =>
    import('../../shared/badge/demos/badge-status.demo').then((m) => m.BadgeStatusDemo),
};

@Injectable({ providedIn: 'root' })
export class DemoRegistry {
  async load(demoKey: string): Promise<Type<unknown>> {
    const loader = DEMOS[demoKey];

    if (!loader) {
      throw new Error(`Demo no registrada: ${demoKey}`);
    }

    return loader();
  }
}
