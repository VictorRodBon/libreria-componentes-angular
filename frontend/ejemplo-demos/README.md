# Ejemplo de demos interactivas

Ejemplo mínimo y autocontenido de cómo funcionan las demos de la guía
[`GUIA_ARQUITECTURA.md`](../GUIA_ARQUITECTURA.md).

> Esta carpeta es **código de referencia**. No forma parte todavía de un
> proyecto Angular compilable; está pensada para copiarse dentro de `src/app/`.

## Qué demuestra

- Un componente real de la librería (`app-button`).
- Dos demos interactivas para ese componente.
- Un registro `demo_key → import()` que carga cada demo bajo demanda.
- Una página que pinta la demo viva y el código de ejemplo por separado.

## Flujo

```
MOCK_COMPONENTE.ejemplos[].demo_key = "button-primary"
                    │
                    ▼
        <app-demo-host demoKey="button-primary">
                    │
                    ▼
        DemoRegistry.load("button-primary")
                    │
                    ▼
        import('./button-primary.demo')   ← solo ahora se descarga
                    │
                    ▼
        ButtonPrimaryDemo
                    │
                    ▼
        <app-button>  ← componente real
```

## Archivos

| Archivo | Qué hace |
|---|---|
| `componente.model.ts` | Interfaces `Categoria`, `Ejemplo`, `Componente`. |
| `mock-componente.ts` | Datos de prueba sin backend. |
| `componente.service.ts` | Devuelve el componente por selector (mock). |
| `button.component.ts` | Componente real de la librería. |
| `button-primary.demo.ts` | Demo 1: botón primario con controles. |
| `button-secondary.demo.ts` | Demo 2: botón secundario deshabilitable. |
| `demo-registry.service.ts` | Mapa `demo_key → import()`. |
| `demo-host.component.ts` | Carga y renderiza la demo con `NgComponentOutlet`. |
| `code-block.component.ts` | Muestra el código de ejemplo como texto. |
| `componente-page.component.ts` | Página de detalle con demos y código. |
| `app.routes.example.ts` | Ruta `/docs/:categoriaSlug/:selector`. |

## Cómo probarlo en un proyecto Angular

1. Crea el proyecto (requiere Angular 19 o superior):

   ```bash
   npm create @angular@latest mi-libreria
   cd mi-libreria
   ```

2. Copia los archivos dentro de `src/app/`. Por ejemplo:

   ```
   src/app/
   ├── core/models/componente.model.ts
   ├── core/services/componente.service.ts
   ├── core/services/demo-registry.service.ts
   ├── core/mock/mock-componente.ts
   ├── shared/button/button.component.ts
   ├── shared/button/demos/button-primary.demo.ts
   ├── shared/button/demos/button-secondary.demo.ts
   ├── shared/demo-host/demo-host.component.ts
   ├── shared/code-block/code-block.component.ts
   └── features/docs/componente-page.component.ts
   ```

3. Ajusta las rutas de los `import` a las nuevas ubicaciones. Lo más importante
   son las de `demo-registry.service.ts`:

   ```ts
   'button-primary': () =>
     import('../../shared/button/demos/button-primary.demo')
       .then((m) => m.ButtonPrimaryDemo),
   ```

4. Configura `app.config.ts`:

   ```ts
   import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
   import { provideRouter, withComponentInputBinding } from '@angular/router';
   import { provideHttpClient } from '@angular/common/http';
   import { routes } from './app.routes';

   export const appConfig: ApplicationConfig = {
     providers: [
       provideZoneChangeDetection({ eventCoalescing: true }),
       provideRouter(routes, withComponentInputBinding()),
       provideHttpClient(),
     ],
   };
   ```

5. Añade la ruta a `app.routes.ts`:

   ```ts
   import { Routes } from '@angular/router';

   export const routes: Routes = [
     {
       path: 'docs/:categoriaSlug/:selector',
       loadComponent: () =>
         import('./features/docs/componente-page.component')
           .then((m) => m.ComponentePageComponent),
     },
     { path: '', redirectTo: 'docs/form-controls/app-button', pathMatch: 'full' },
   ];
   ```

6. Arranca:

   ```bash
   ng serve
   ```

   Abre `http://localhost:4200/docs/form-controls/app-button`.

> Si usas Angular 18 o anterior, añade `standalone: true` a todos los
> componentes del ejemplo.

## Conectar con la API real

Sustituye el método mock de `componente.service.ts`:

```ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Componente } from './componente.model';

@Injectable({ providedIn: 'root' })
export class ComponenteService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3000/api';

  getComponente(selector: string): Observable<Componente> {
    return this.http.get<Componente>(`${this.api}/componentes/${selector}`);
  }
}
```

El backend debe devolver un JSON con esta forma:

```json
{
  "id": 1,
  "nombre": "Button",
  "selector": "app-button",
  "descripcion": "Botón interactivo...",
  "categoria": { "id": 1, "nombre": "Form Controls", "slug": "form-controls" },
  "ejemplos": [
    {
      "id": 1,
      "titulo": "Botón primario",
      "codigo_html": "<app-button color=\"primary\">Guardar</app-button>",
      "codigo_ts": "export class ButtonExample {}",
      "demo_key": "button-primary",
      "orden": 1
    }
  ]
}
```

Si un ejemplo no tiene demo interactiva, `demo_key` será `null` y la página
mostrará únicamente el código.

## Añadir una demo nueva

1. Crea el componente en `shared/<componente>/demos/`, por ejemplo
   `button-loading.demo.ts` con la clase `ButtonLoadingDemo`.
2. Regístralo en `DEMOS`:

   ```ts
   'button-loading': () =>
     import('./button-loading.demo').then((m) => m.ButtonLoadingDemo),
   ```

3. Añade el ejemplo en la BD con `demo_key = 'button-loading'`.
4. No hay que tocar la página: `DemoHost` resuelve la clave automáticamente.

## Nota sobre seguridad

`codigo_html` y `codigo_ts` son **texto para mostrar**. No se ejecutan con
`innerHTML` ni `bypassSecurityTrustHtml`. La demo viva siempre es código Angular
compilado y registrado.
