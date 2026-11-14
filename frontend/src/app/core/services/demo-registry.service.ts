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
    import('../../shared/examples/button/demos/button-primary.demo').then((m) => m.ButtonPrimaryDemo),
  'button-secondary': () =>
    import('../../shared/examples/button/demos/button-secondary.demo').then((m) => m.ButtonSecondaryDemo),
  'card-basic': () =>
    import('../../shared/examples/card/demos/card-basic.demo').then((m) => m.CardBasicDemo),
  'badge-status': () =>
    import('../../shared/examples/badge/demos/badge-status.demo').then((m) => m.BadgeStatusDemo),
  'spinner-loading': () =>
    import('../../shared/examples/spinner/demos/spinner-loading.demo').then((m) => m.SpinnerLoadingDemo),
  'alert-success': () =>
    import('../../shared/examples/alert/demos/alert-success.demo').then((m) => m.AlertSuccessDemo),
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
