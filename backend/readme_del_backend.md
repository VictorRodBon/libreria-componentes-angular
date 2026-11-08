# Backend API — Componentes (Node.js + Express + MariaDB)

Este proyecto es la API REST backend para la gestión de componentes y usuarios. Está desarrollado en **Node.js** utilizando **Express.js** bajo la arquitectura de Módulos ES (ESM) y conectado a una base de datos **MariaDB** desplegada mediante **Docker Compose**.

## 🚀 Tecnologías Utilizadas

* **Node.js** (v26+) — Entorno de ejecución para JavaScript.
* **Express.js** (v5+) — Framework web rápido y minimalista para las rutas y endpoints API.
* **MariaDB** (v11.4) — Sistema de gestión de bases de datos relacional.
* **Docker & Docker Compose** — Contenerización de la base de datos de forma limpia e independiente.
* **mysql2/promise** — Driver de conexión asíncrona (async/await) para MariaDB/MySQL.
* **dotenv** — Gestión de variables de entorno.
* **cors** — Middleware para permitir peticiones desde clientes externos (como Angular).

## 📁 Estructura del Proyecto y Descripción de Archivos

```
backend/
├── .env                    # Archivo con credenciales y variables de entorno (no subir a git)
├── docker-compose.yml      # Configuración del contenedor Docker de MariaDB
├── init.sql                # Script de inicialización con esquemas e inserciones iniciales
├── index.js                # Punto de entrada principal del servidor Express
├── package.json            # Dependencias y scripts de ejecución
└── src/
    ├── config/
    │   └── db.js           # Pool de conexiones a MariaDB
    ├── models/             # Abstracción y consultas a la base de datos (Entidades / DAOs)
    │   └── usuario.model.js
    ├── controllers/        # Lógica de negocio HTTP y orquestación
    │   └── usuario.controller.js
    └── routes/             # Definición de rutas y endpoints de la API
        └── usuario.routes.js
```

---

## 🏛️ Arquitectura y Separación de Responsabilidades (MVC)

Para mantener una arquitectura escalable, mantenible y limpia, el proyecto sigue el patrón **Modelo-Vista-Controlador (MVC)** (adaptado a API REST), dividiendo estrictamente el flujo de una petición:

```text
Cliente (Angular) ──(HTTP)──> Rutas ──> Controlador ──> Modelo ──> MariaDB
```

### 1. Las Rutas (`src/routes/`)
* **Rol:** Definen las URLs/endpoints (`GET /api/usuarios`, `POST /api/usuarios`) y los verbos HTTP.
* **Responsabilidad:** Recibir la petición y redirigirla al controlador correspondiente sin procesar lógica.

### 2. Los Controladores (`src/controllers/`)
* **Rol:** Encargados de la orquestación HTTP y la lógica de flujo.
* **Responsabilidad:** 
  * Validar los datos de entrada recibidos en `req.body` o `req.params`.
  * Llamar a las funciones del **Modelo** para consultar o persistir información.
  * Formatear y enviar las respuestas HTTP con sus respectivos estados (`200 OK`, `201 Created`, `400 Bad Request`, `500 Internal Error`).
  * **Importante:** El controlador **NUNCA** interactúa ni ejecuta sentencias SQL directamente.

### 3. Los Modelos (`src/models/`)
* **Rol:** Capa de acceso a datos (*Data Access Object / Entidad*).
* **Responsabilidad:**
  * Es la **única capa** autorizada para comunicarse directamente con MariaDB mediante el `pool` de conexiones.
  * Encapsula las sentencias SQL (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).
  * Mantiene la abstracción de la base de datos: si en el futuro se cambia de MariaDB a otra base de datos, solo se modifican los modelos sin impactar controladores ni rutas.

---

### 📄 Explicación Detallada de cada Fichero

#### Raíz del proyecto:

* **`package.json`**: Define el proyecto como Módulo ES (`"type": "module"`), declara las dependencias (`express`, `mysql2`, `cors`, `dotenv`) y los scripts de ejecución (`npm run dev`).
* **`index.js`**: Es el archivo ejecutable del servidor. Configura los middlewares globales (`cors`, `express.json`), conecta las rutas de la API (`/api`), maneja el puerto de escucha y arranca el servidor HTTP.
* **`docker-compose.yml`**: Configura el contenedor de MariaDB 11.4, mapea los puertos (`3306`), asigna las variables de entorno de la base de datos y ejecuta el script `init.sql`.
* **`init.sql`**: Script ejecutable por MariaDB la primera vez que se inicia el contenedor. Contiene las sentencias `CREATE TABLE` e `INSERT` de prueba.
* **`.env`**: Archivo de configuración local donde residen los datos sensibles (passwords, puertos, hosts).

#### Carpeta `src/`:

* **`src/config/db.js`**: Crea y exporta el pool de conexiones reutilizable (`mysql.createPool`) leyendo los datos de `.env`. Controla el límite de conexiones concurrentes.
* **`src/models/usuario.model.js`**: Contiene las funciones y métodos estáticos que ejecutan las sentencias SQL sobre la tabla de usuarios.
* **`src/controllers/usuario.controller.js`**: Procesa la validación de peticiones (`req`), invoca los métodos de `usuario.model.js` y responde al cliente (`res`).
* **`src/routes/usuario.routes.js`**: Expone las URLs finales mapeadas a las funciones del controlador.

## ⚙️ Configuración del Entorno (`.env`)

Crea un archivo llamado `.env` en la raíz del backend con los siguientes parámetros:

```env
PORT=3000

# Configuración Base de Datos
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=Clave$1
DB_NAME=ComponentesDB
DB_PORT=3306
```

## 🛠️ Instrucciones de Despliegue y Uso

### 1. Iniciar la Base de Datos (Docker)

En la raíz del proyecto donde se encuentra el `docker-compose.yml`, ejecuta:

```bash
docker compose up -d
```

### 2. Instalar Dependencias de Node.js

```bash
npm install
```

### 3. Ejecutar el Servidor Backend

Para entorno de **desarrollo** con recarga automática (*watch mode*):

```bash
npm run dev
```

Para entorno de **producción** o ejecución simple:

```bash
npm start
```

## 📌 Endpoints de la API

| Método | Ruta | Descripción | Cuerpo (JSON) |
| ----- | ----- | ----- | ----- |
| `GET` | `/` | Comprobación de estado del servidor | N/A |
| `GET` | `/api/usuarios` | Obtiene la lista completa de usuarios | N/A |
| `POST` | `/api/usuarios` | Registra un nuevo usuario en la base de datos | `{"nombre": "String", "email": "String", "rol": "String"}` |

### Ejemplo de petición POST (`curl`):

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Laura Gómez", "email": "laura@example.com", "rol": "desarrollador"}'
```