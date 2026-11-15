# Catálogo de componentes Angular

Aplicación web que muestra un catálogo de componentes Angular reutilizables. Cada componente tiene su página con descripción, **demo interactiva** (con controles para cambiar sus propiedades en vivo) y **código de ejemplo** (HTML, TypeScript y CSS).

Proyecto de clase de 2º DAM (Ampliación de desarrollo de interfaces) realizado en equipo.

## Qué incluye

- **Frontend** en Angular 22 (componentes *standalone*, signals, Angular Router).
- **Backend** en Node.js + Express que sirve el catálogo y gestiona usuarios (registro, login con JWT) y favoritos.
- **Base de datos** MariaDB en Docker, con el catálogo cargado desde `backend/init.sql`.

## Requisitos previos

- [Node.js](https://nodejs.org/) 22.22 o superior, o 24.15 o superior (incluye npm)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para la base de datos)
- Angular CLI: `npm install -g @angular/cli`

## Puesta en marcha

Hacen falta tres cosas encendidas a la vez: la base de datos, el backend y el frontend. Usa una terminal para cada una.

### 1. Base de datos

```bash
cd backend
docker compose up -d
```

Abre Docker Desktop antes y espera a que ponga *Engine running*. La primera vez, MariaDB carga `init.sql` con el catálogo (tarda unos segundos).

### 2. Backend

En `backend/` crea un fichero `.env` con este contenido:

```env
PORT=3000
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=Clave$1
DB_NAME=ComponentesDB
DB_PORT=3306
JWT_SECRET=pon_aqui_una_clave_larga_cualquiera
```

Después:

```bash
npm install
npm run dev
```

La API queda en `http://localhost:3000/api`.

### 3. Frontend

```bash
cd frontend
npm install
ng serve
```

Abre `http://localhost:4200/`.

## Si algo falla

| Síntoma | Causa y solución |
|---|---|
| La web carga pero no sale ningún componente, o aparecen errores en la consola (`ERR_CONNECTION_REFUSED`) | El backend está apagado. Arráncalo con `npm run dev` en `backend/` y recarga |
| El backend dice que no puede conectar con la base de datos | Docker Desktop no está abierto o el contenedor no ha terminado de arrancar. Abre Docker, ejecuta `docker compose up -d` en `backend/`, espera 10 segundos y vuelve a lanzar `npm run dev` |
| `docker compose up -d` dice `no configuration file provided` | Estás en otra carpeta. Ejecútalo dentro de `backend/` |
| El login falla o el backend no arranca por `JWT_SECRET` | Falta esa línea en `backend/.env` |
| `ng` no se reconoce como comando | Instala Angular CLI (`npm install -g @angular/cli`) y abre una terminal nueva |
| `Port 4200 is already in use` | Hay otro `ng serve` abierto. Ciérralo; no uses otro puerto, porque el backend solo acepta peticiones desde `http://localhost:4200` |
| Cambié `init.sql` y el catálogo sigue igual | El script solo se ejecuta con la base vacía. Reinicia con `docker compose down -v` y `docker compose up -d` (borra los datos) |

## Comandos útiles (desde `frontend/`)

| Comando | Qué hace |
|---|---|
| `ng serve` | Servidor de desarrollo con recarga automática |
| `ng build` | Compila para producción en `dist/frontend` |
| `ng test` | Ejecuta las pruebas unitarias (Vitest) |
| `ng generate component shared/examples/nombre` | Crea un componente con su `.ts`, `.html` y `.css` |

## Estructura del frontend

```
frontend/src/app/
├── core/                 # Lógica compartida de la aplicación
│   ├── guards/           # authGuard: protege rutas que exigen sesión
│   ├── interceptors/     # authInterceptor: añade el token a las peticiones a la API
│   ├── models/           # Interfaces TypeScript (Componente, Ejemplo, Usuario…)
│   └── services/         # CatalogService, ComponenteService, AuthService, DemoRegistry
├── features/             # Páginas cargadas por ruta: detalle de componente, login y registro
└── shared/
    ├── components/       # Piezas de la aplicación: layout (menú), inicio, main (listado por categoría),
    │                     # favoritos, card-componente, fav-button, btn-atras, code-block, demo-host
    ├── auth-bar/         # Barra superior: marca, iniciar sesión, registrarse
    └── examples/         # Componentes de la librería y sus demos
        ├── button/  card/  badge/  spinner/  alert/
        └── input/  checkbox/  switch/
```

Cada componente de `shared/examples/` vive en su carpeta con tres ficheros separados (`.ts`, `.html`, `.css`), su prueba `.spec.ts` y sus demos en `demos/`.

### Páginas y menú

| Ruta | Página |
|---|---|
| `/` | Inicio |
| `/categoria` y `/categoria/:slug` | Listado de componentes, todos o por categoría |
| `/docs/:categoria/:selector` | Detalle de un componente con su demo y su código |
| `/favoritos` | Favoritos del usuario (protegida por `authGuard`) |
| `/login` y `/registro` | Inicio de sesión y registro |

La barra superior lleva a Inicio, Iniciar sesión y Registrarse; la barra lateral, a cada categoría y a Favoritos.

## Componentes

Todos se importan como componentes *standalone*. Los valores por defecto son los que se usan si no se indica la propiedad.

### `app-button`

| Propiedad | Valores | Por defecto |
|---|---|---|
| `color` | `primary`, `secondary` | `primary` |
| `disabled` | `true`, `false` | `false` |

```html
<app-button color="secondary" [disabled]="cargando">Cancelar</app-button>
```

### `app-card`

| Propiedad | Valores | Por defecto |
|---|---|---|
| `titulo` | texto | vacío |
| `subtitulo` | texto | vacío |

El contenido va en el cuerpo. Lo que lleve el atributo `footer` se proyecta en el pie.

```html
<app-card titulo="Análisis" subtitulo="Cierre Q3">
  <p>Contenido de la tarjeta.</p>
  <div footer><app-button>Ver detalles</app-button></div>
</app-card>
```

### `app-badge`

| Propiedad | Valores | Por defecto |
|---|---|---|
| `color` | `neutral`, `success`, `warning`, `danger`, `info` | `neutral` |
| `variant` | `subtle`, `solid`, `outline` | `subtle` |

```html
<app-badge color="success" variant="subtle">Activo</app-badge>
```

### `app-spinner`

| Propiedad | Valores | Por defecto |
|---|---|---|
| `size` | `sm`, `md`, `lg` | `md` |
| `color` | `primary`, `neutral`, `danger` | `primary` |
| `label` | texto para lectores de pantalla | `Cargando` |

```html
<app-spinner size="lg" color="primary"></app-spinner>
```

### `app-alert`

| Propiedad | Valores | Por defecto |
|---|---|---|
| `type` | `info`, `success`, `warning`, `danger` | `info` |
| `titulo` | texto | vacío |
| `cerrable` | `true`, `false` | `false` |

| Evento | Cuándo se emite |
|---|---|
| `dismissed` | Al cerrarse la alerta (botón de cerrar o método `close()`) |

| Método | Qué hace |
|---|---|
| `close()` | Oculta la alerta y emite `dismissed` |

```html
<app-alert type="success" titulo="Guardado" [cerrable]="true" (dismissed)="alCerrar()">
  Los cambios se han guardado correctamente.
</app-alert>
```

### `app-input`

| Propiedad | Valores | Por defecto |
|---|---|---|
| `label` | texto | vacío |
| `placeholder` | texto | vacío |
| `type` | `text`, `email`, `password` | `text` |
| `required` | `true`, `false` | `false` |
| `disabled` | `true`, `false` | `false` |
| `value` | texto, con doble enlace `[(value)]` | vacío |

| Evento | Cuándo se emite |
|---|---|
| `valueChange` | En cada cambio del texto (lo genera `model()`) |
| `submitted` | Al pulsar Enter, con el texto actual |

| Método | Qué hace |
|---|---|
| `clear()` | Vacía el campo |

```html
<app-input label="Nombre" placeholder="Ej. Ana" [required]="true" [(value)]="nombre" (submitted)="enviar($event)"></app-input>
```

### `app-checkbox`

| Propiedad | Valores | Por defecto |
|---|---|---|
| `label` | texto | vacío |
| `disabled` | `true`, `false` | `false` |
| `checked` | `true`, `false`, con doble enlace `[(checked)]` | `false` |

| Evento | Cuándo se emite |
|---|---|
| `changed` | Al marcarla o desmarcarla, con el nuevo estado |

| Método | Qué hace |
|---|---|
| `toggle()` | Invierte el estado y emite `changed` (no hace nada si está desactivada) |

```html
<app-checkbox label="Acepto los términos" [(checked)]="aceptado" (changed)="alCambiar($event)"></app-checkbox>
```

### `app-switch`

| Propiedad | Valores | Por defecto |
|---|---|---|
| `label` | texto | vacío |
| `size` | `sm`, `md` | `md` |
| `disabled` | `true`, `false` | `false` |
| `checked` | `true`, `false`, con doble enlace `[(checked)]` | `false` |

| Evento | Cuándo se emite |
|---|---|
| `changed` | Al pulsarlo, con el nuevo estado |

| Método | Qué hace |
|---|---|
| `toggle()` | Invierte el estado y emite `changed` (no hace nada si está desactivado) |

```html
<app-switch label="Modo oscuro" [(checked)]="modoOscuro" (changed)="alCambiar($event)"></app-switch>
```

### Componentes sin demo

`app-tabs` y `app-modal` están en el catálogo pero todavía no tienen demo. Se dejan a propósito para mostrar cómo responde la aplicación: la página carga la información y el código, y en lugar de la demo aparece el aviso "Demo no registrada".

## Pruebas unitarias

Cada componente tiene su fichero `.spec.ts` al lado (Vitest + TestBed). Comprueban los valores por defecto, que cada propiedad cambia lo que se pinta y que los eventos (`dismissed`, `changed`, `submitted`, `valueChange`) se emiten cuando toca. También hay pruebas de creación de las páginas (inicio, layout, main, favoritos…). `AuthService` se prueba con `HttpTestingController`, sin necesidad de backend.

```bash
cd frontend
ng test --watch=false
```

## Cómo funciona el catálogo

La información de cada componente (nombre, descripción, ejemplos de código) vive en la base de datos y llega por la API. Las demos son código Angular real dentro del frontend.

Dos claves enlazan ambos mundos:

- `selector` (`app-card`): identifica el componente y forma la URL de su página.
- `demo_key` (`card-basic`): identifica qué demo cargar. Debe coincidir en `backend/init.sql` y en `core/services/demo-registry.service.ts`.

Para añadir un componente nuevo: crear su carpeta en `shared/examples/`, escribir su demo en `shared/examples/<componente>/demos/`, registrar el `demo_key` en `DemoRegistry` y añadir sus filas en `init.sql`.

## API (resumen)

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/componentes/catalogo` | Público |
| GET | `/api/componentes/catalogo/:slug` | Público |
| GET | `/api/componentes/:selector` | Público |
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| GET | `/api/favoritos` | Requiere `Authorization: Bearer <token>` |

## Autoría

- **Víctor Rodriguez Bon**: backend (API, base de datos, seguridad).
- **Matías Romani Alviño**: diseño del frontend y páginas.
- **Marcos Casas**: componentes y sus demos; servicios que conectan frontend y backend (`CatalogService`, `AuthService`), interceptor y guard de autenticación.