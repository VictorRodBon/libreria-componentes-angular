# Guía de arquitectura — Web de componentes Angular

## 1. Principios

| Elemento | Dónde vive | Se modifica con |
|---|---|---|
| Componentes Angular (`ButtonComponent`…) | `frontend/src/app/shared/` | Compilación / despliegue |
| Demos interactivas | `frontend/src/app/shared/<componente>/demos/` | Compilación / despliegue |
| Categorías, descripciones, ejemplos | MariaDB + API | Cambios en BD |
| Usuarios y favoritos | MariaDB + API | Tiempo de ejecución |

El frontend **no hardcodea el catálogo**: lo pide a la API. Los componentes y sus demos **sí son código** y se cargan bajo demanda.

El contrato entre backend y frontend son dos claves estables:

- `selector`: `app-button`, `app-navbar`…
- `demo_key`: `button-primary`, `navbar-basic`… (uno por ejemplo)

### Implementación vs metadatos

**Implementación** = el código Angular real del componente. Es lo que se compila y se ejecuta en el navegador:

```ts
// frontend/src/app/shared/button/button.ts
@Component({
  selector: 'app-button',
  template: `<button [class]="'btn btn-' + color()"><ng-content /></button>`,
})
export class ButtonComponent {
  color = input<'primary' | 'secondary'>('primary');
}
```

**Metadatos** = la información *sobre* ese componente: nombre, categoría, descripción, selector y ejemplos de código. Eso vive en MariaDB y lo sirve la API:

```json
{
  "nombre": "Button",
  "selector": "app-button",
  "descripcion": "Botón interactivo personalizable...",
  "categoria": { "nombre": "Form Controls", "slug": "form-controls" },
  "ejemplos": [
    {
      "titulo": "Botón primario",
      "codigo_html": "<app-button color=\"primary\">Guardar</app-button>",
      "demo_key": "button-primary"
    }
  ]
}
```

La relación es como un **menú de restaurante** (metadatos) frente a la **cocina** (implementación): el menú puede cambiar sin recompilar la cocina, pero el plato tiene que existir en el código. El `selector` y el `demo_key` son el enlace entre ambos.

Con demos interactivas, la idea es:

- La BD guarda el **código de ejemplo** para mostrarlo (texto).
- La BD guarda un **`demo_key`** que identifica qué demo Angular hay que cargar.
- El frontend tiene un **registro** `demo_key → import()`, y solo descarga la demo del componente que se está viendo.
- La demo es un componente Angular real, con sus controles (`color`, `disabled`, etc.). Nunca se ejecuta el HTML de la BD.

## 2. Flujo general

```
MariaDB
  └─ API Express (JWT para favoritos)
       ├─ GET /api/categorias              → menú lateral
       ├─ GET /api/categorias/:slug        → índice de componentes
       ├─ GET /api/componentes/:selector   → detalle + ejemplos (con demo_key)
       └─ /api/auth, /api/favoritos        → usuario
                    │
                    ▼
           Angular (servicios + signals)
                    │
      ┌─────────────┼──────────────┐
      ▼             ▼              ▼
  Categoría     Componente      Favoritos
  (lista)       (demo + código)  (solo logueado)
```

## 3. Contrato API propuesto

```
GET  /api/categorias
     → [{ id, nombre, slug, descripcion, totalComponentes }]

GET  /api/categorias/:slug
     → { id, nombre, slug, descripcion, componentes: [{ id, nombre, selector, descripcion }] }

GET  /api/componentes/:selector
     → { id, nombre, selector, descripcion, categoria: {...},
         ejemplos: [{ id, titulo, codigo_html, codigo_ts, demo_key, orden }] }

POST /api/auth/register
POST /api/auth/login
     → { token, data: { id, nombre, email } }

GET    /api/favoritos                 → requiere Bearer token
POST   /api/favoritos                 → { componenteId }
DELETE /api/favoritos/:componenteId   → requiere Bearer token
```

Cambios de BD necesarios:

```sql
-- demo_key: enlaza cada ejemplo con su demo Angular (NULL = solo código)
ALTER TABLE ejemplos ADD COLUMN demo_key VARCHAR(100) NULL;

-- El selector debe ser único para GET /api/componentes/:selector
ALTER TABLE componentes ADD UNIQUE KEY uq_componentes_selector (selector);

-- Carga eficiente de ejemplos ordenados
ALTER TABLE ejemplos ADD INDEX idx_ejemplos_componente_orden (componente_id, orden);

-- Evita favoritos duplicados y acelera el listado por usuario
ALTER TABLE favoritos ADD UNIQUE KEY uq_favoritos_usuario_componente (usuario_id, componente_id);
ALTER TABLE favoritos ADD INDEX idx_favoritos_usuario_creado (usuario_id, creado_en);
```

En el backend, estos cambios están en `init.sql` (para BD nueva) y en
`migrations/001_demos_y_favoritos.sql` (para BD existente).

## 4. Estructura de carpetas

```
frontend/src/app/
├── core/
│   ├── services/
│   │   ├── catalog.service.ts
│   │   ├── auth.service.ts
│   │   ├── favoritos.service.ts
│   │   └── demo-registry.service.ts
│   ├── interceptors/auth.interceptor.ts
│   ├── guards/auth.guard.ts
│   └── models/ (categoria.ts, componente.ts, ejemplo.ts, usuario.ts)
├── shared/
│   ├── button/
│   │   ├── button.ts
│   │   └── demos/
│   │       ├── button-primary.demo.ts
│   │       └── button-disabled.demo.ts
│   ├── navbar/...
│   ├── demo-host/demo-host.ts
│   └── code-block/code-block.ts
├── features/
│   ├── home/home.ts
│   ├── docs/
│   │   ├── docs-layout.ts
│   │   ├── categoria-page.ts
│   │   └── componente-page.ts
│   ├── auth/login.ts / registro.ts
│   └── favoritos/favoritos-page.ts
├── app.routes.ts
├── app.config.ts
└── app.ts
```

## 5. Servicios principales

```ts
// core/services/catalog.service.ts
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;
  private cache = new Map<string, Observable<unknown>>();

  getCategorias(): Observable<Categoria[]> {
    return this.cached('categorias', () =>
      this.http.get<Categoria[]>(`${this.api}/categorias`)
    );
  }

  getCategoria(slug: string) { /* GET /categorias/:slug */ }
  getComponente(selector: string) { /* GET /componentes/:selector */ }

  private cached<T>(key: string, factory: () => Observable<T>): Observable<T> {
    if (!this.cache.has(key)) {
      this.cache.set(key, factory().pipe(shareReplay(1)));
    }
    return this.cache.get(key) as Observable<T>;
  }
}
```

Así el menú lateral y la página comparten la misma petición.

## 6. Demos interactivas

### 6.1 Registro de demos

```ts
// core/services/demo-registry.service.ts
import { Type } from '@angular/core';

type DemoLoader = () => Promise<Type<unknown>>;

const DEMOS = {
  'button-primary': () =>
    import('../../shared/button/demos/button-primary.demo').then(m => m.ButtonPrimaryDemo),
  'button-disabled': () =>
    import('../../shared/button/demos/button-disabled.demo').then(m => m.ButtonDisabledDemo),
} satisfies Record<string, DemoLoader>;

@Injectable({ providedIn: 'root' })
export class DemoRegistry {
  load(demoKey: string): Promise<Type<unknown>> {
    const loader = DEMOS[demoKey];
    if (!loader) {
      return Promise.reject(new Error(`Demo no registrada: ${demoKey}`));
    }
    return loader();
  }
}
```

Cada `import()` crea un chunk separado: solo se descarga cuando se abre ese ejemplo.

### 6.2 Componente demo

```ts
// shared/button/demos/button-primary.demo.ts
@Component({
  selector: 'app-button-primary-demo',
  imports: [ButtonComponent],
  template: `
    <app-button [color]="color()" [disabled]="disabled()">Guardar</app-button>

    <label>Color:
      <select [value]="color()" (change)="color.set($any($event.target).value)">
        <option value="primary">primary</option>
        <option value="secondary">secondary</option>
      </select>
    </label>

    <label>
      <input type="checkbox" [checked]="disabled()"
             (change)="disabled.set($any($event.target).checked)">
      Deshabilitado
    </label>
  `,
})
export class ButtonPrimaryDemo {
  color = signal<'primary' | 'secondary'>('primary');
  disabled = signal(false);
}
```

La interactividad vive aquí, en código Angular tipado. La BD solo dice “para este ejemplo carga `button-primary`”.

### 6.3 Host de demos

```ts
// shared/demo-host/demo-host.ts
@Component({
  selector: 'app-demo-host',
  imports: [NgComponentOutlet],
  template: `
    @if (loading()) {
      <app-spinner />
    } @else if (error()) {
      <p class="demo-error">Demo no disponible.</p>
    } @else if (component(); as comp) {
      <ng-container [ngComponentOutlet]="comp" />
    }
  `,
})
export class DemoHost {
  readonly demoKey = input.required<string>();

  private registry = inject(DemoRegistry);
  readonly component = signal<Type<unknown> | null>(null);
  readonly loading = signal(false);
  readonly error = signal(false);

  constructor() {
    effect(() => { void this.load(this.demoKey()); });
  }

  private async load(key: string) {
    this.loading.set(true);
    this.error.set(false);
    try {
      this.component.set(await this.registry.load(key));
    } catch {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
```

### 6.4 Mostrar el código

```html
<!-- El HTML de la BD se muestra como TEXTO, nunca se ejecuta -->
<pre><code>{{ ejemplo.codigo_html }}</code></pre>
```

Para resaltado de sintaxis, usa `highlight.js` o Prism **escapando** primero el contenido. Está prohibido:

```ts
// ❌ XSS y Angular no compila las directivas
element.innerHTML = ejemplo.codigo_html;
```

## 7. Rutas

```ts
// app.routes.ts
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then(m => m.Home) },
  {
    path: 'docs',
    loadComponent: () => import('./features/docs/docs-layout').then(m => m.DocsLayout),
    children: [
      { path: ':categoriaSlug', loadComponent: () => import('./features/docs/categoria-page').then(m => m.CategoriaPage) },
      { path: ':categoriaSlug/:selector', loadComponent: () => import('./features/docs/componente-page').then(m => m.ComponentePage) },
    ],
  },
  {
    path: 'favoritos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/favoritos/favoritos-page').then(m => m.FavoritosPage),
  },
  { path: 'login', loadComponent: () => import('./features/auth/login').then(m => m.Login) },
  { path: 'registro', loadComponent: () => import('./features/auth/registro').then(m => m.Registro) },
  { path: '**', redirectTo: '' },
];
```

En `app.config.ts`:

```ts
provideRouter(routes, withComponentInputBinding()),
provideHttpClient(withInterceptors([authInterceptor])),
```

Con `withComponentInputBinding()` puedes leer los parámetros de ruta con `input()`:

```ts
export class ComponentePage {
  readonly selector = input.required<string>();
  readonly categoriaSlug = input.required<string>();
}
```

## 8. Flujo de usuario

### Público

```
Home → Categoría → Componente (demo + código)
```

No requiere sesión.

### Login

```ts
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  return next(
    token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req
  );
};
```

```ts
// auth.guard.ts
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
```

### Favoritos

```
Visitante pulsa favorito → redirige a /login?returnUrl=...
Login correcto        → vuelve a returnUrl
Usuario autenticado   → POST /api/favoritos { componenteId }
"Mis favoritos"       → GET /api/favoritos
Quitar favorito       → DELETE /api/favoritos/:componenteId
```

Reglas:

- El `usuario_id` sale siempre del JWT en el backend.
- El botón de favorito refleja el estado actual y hace actualización optimista.
- Si la API devuelve `401`, se limpia la sesión y se redirige a login.

## 9. Rendimiento

- **Lazy loading** de páginas y demos (chunks independientes).
- `shareReplay(1)` para no repetir peticiones del catálogo.
- `@defer` para demos que están muy abajo en la página:

```html
@defer (on viewport) {
  <app-demo-host [demoKey]="ejemplo.demo_key" />
} @placeholder {
  <div class="demo-skeleton"></div>
}
```

- Precarga opcional de las rutas más visitadas con `withPreloading(PreloadAllModules)`.
- No importes todos los componentes en el `AppComponent`.

## 10. Seguridad

- No ejecutar `codigo_html` de la BD (`innerHTML` / `bypassSecurityTrustHtml`).
- Validar en backend que el favorito pertenece al usuario del token.
- Añadir `UNIQUE (usuario_id, componente_id)`.
- En producción, valorar JWT en cookie `HttpOnly` en lugar de `localStorage`.
- Validar `slug`, `selector` y `demoKey` contra listas/registros conocidos.

## 11. Checklist de implementación

- [ ] Crear proyecto Angular con standalone components, signals y `provideHttpClient`.
- [ ] Añadir `demo_key` a `ejemplos` y `UNIQUE` a `favoritos` en el backend.
- [ ] Implementar endpoints de categorías, componente por selector y favoritos.
- [ ] Crear `CatalogService`, `AuthService`, `FavoritosService`, `DemoRegistry`.
- [ ] Crear layout de docs con menú lateral desde la API.
- [ ] Crear los componentes reales en `shared/` y sus demos interactivas.
- [ ] Implementar `DemoHost`, `CodeBlock` y la página de componente.
- [ ] Implementar login/registro, interceptor y guard.
- [ ] Implementar página y botón de favoritos.
- [ ] Probar rutas, 401, 404 y demo inexistente.
