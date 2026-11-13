# Plan de corrección del backend

> Ordenado por prioridad. Marca cada casilla al completarla.
> Rutas relativas a `backend/`.

---

## Fase 1 — Bloqueantes (favoritos) ✅ COMPLETADA

### 1.1 Crear `FavoritoModel.obtenerPorUsuarioYComponente`
- [x] En `src/models/favorito.model.js`, añadir el método que falta (el controlador ya lo llama en `favorito.controller.js:21`).
  ```js
  async obtenerPorUsuarioYComponente(usuarioId, componenteId) {
      const [rows] = await pool.query(
          'SELECT id FROM favoritos WHERE usuario_id = ? AND componente_id = ?',
          [usuarioId, componenteId]
      );
      return rows[0] ?? null;
  }
  ```

### 1.2 Corregir la desestructuración de `req.usuario.id`
- [x] En `src/controllers/favorito.controller.js:18` (`agregarFavorito`):
  ```js
  // ❌ const {usuarioId} = req.usuario.id;
  const usuarioId = req.usuario.id;
  ```
- [x] En `src/controllers/favorito.controller.js:37` (`eliminarFavorito`):
  ```js
  // ❌ const {usuarioId} = req.usuario.id;
  const usuarioId = req.usuario.id;
  ```

### 1.3 Alinear los argumentos de `agregar`
- [x] En `src/controllers/favorito.controller.js:25`, pasar dos argumentos (no un objeto):
  ```js
  // ❌ await FavoritoModel.agregar({ usuarioId, componenteId });
  const nuevoFavorito = await FavoritoModel.agregar(usuarioId, componenteId);
  ```

### 1.4 Corregir el SQL de eliminar y hacer que devuelva resultado
- [x] En `src/models/favorito.model.js`:
  ```js
  async eliminarPorUsuarioIdYComponenteId(usuarioId, componenteId) {
      const [result] = await pool.query(
          'DELETE FROM favoritos WHERE usuario_id = ? AND componente_id = ?',
          [usuarioId, componenteId]
      );
      return result.affectedRows > 0;
  }
  ```
  > Nota: `&&` → `AND`, el segundo `&` → `?`, y devolver si se borró algo.

### 1.5 Reescribir `eliminarFavorito` (un solo DELETE + catch correcto)
- [x] En `src/controllers/favorito.controller.js`:
  ```js
  export const eliminarFavorito = async (req, res) => {
      try {
          const usuarioId = req.usuario.id;
          const { componenteId } = req.params;

          const eliminado = await FavoritoModel.eliminarPorUsuarioIdYComponenteId(usuarioId, componenteId);
          if (!eliminado) {
              return res.status(404).json({ success: false, error: 'El componente no está en favoritos' });
          }
          res.json({ success: true, message: 'Componente eliminado de favoritos correctamente' });
      } catch (error) {
          console.error('Error al eliminar de favoritos:', error.message);
          res.status(500).json({ success: false, error: 'Error interno del servidor al eliminar de favoritos' });
      }
  };
  ```

### 1.6 Registrar las rutas de favoritos
- [x] En `src/routes/favorito.routes.js`, exponer POST y DELETE:
  ```js
  router.get('/', verificarToken, obtenerFavoritos);
  router.post('/:componenteId', verificarToken, agregarFavorito);
  router.delete('/:componenteId', verificarToken, eliminarFavorito);
  ```

### 1.7 Normalizar la respuesta de `agregarFavorito`
- [x] En `src/controllers/favorito.controller.js`, manejar el caso de error y responder siempre.

---

## Fase 2 — Seguridad

### 2.1 Unificar y asegurar `JWT_SECRET` ✅ COMPLETADA
- [x] En `index.js`, validar que exista y abortar si falta:
  ```js
  if (!process.env.JWT_SECRET) {
      console.error('FATAL: falta JWT_SECRET en el entorno');
      process.exit(1);
  }
  ```
- [x] En `src/middleware/auth.middleware.js:2`, eliminar el fallback hardcodeado:
  ```js
  const JWT_SECRET = process.env.JWT_SECRET;
  ```

### 2.2 Restringir CORS
- [x] En `index.js`, limitar al origen del frontend:
  ```js
  app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' }));
  ```
- [ ] Añadir `CORS_ORIGIN` al `.env` y `.env.example`.

### 2.3 Validar entradas con `express-validator`
- [x] Aplicado en `src/routes/auth.routes.js` (register y login).

### 2.4 Manejar duplicados de email con el constraint (sin race condition)
- [x] En `src/controllers/auth.controller.js`, eliminar el pre-check `buscarPorEmail` del registro y capturar `ER_DUP_ENTRY`:
  ```js
  if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, error: 'El correo electrónico ya está registrado.' });
  }
  ```

### 2.5 Sacar credenciales del `docker-compose.yml`
- [ ] Reemplazar `Clave$1` por variables de entorno (`.env`) en `docker-compose.yml`.

### 2.6 Rate limiting en login (opcional pero recomendado)
- [x] Instalado `express-rate-limit@8.7.4` y aplicado solo a `/api/auth/login`: 10 intentos por IP cada 15 minutos.
  > Nota: en producción, detrás de un proxy, añadir `app.set('trust proxy', 1)` para que la limitación se aplique por IP real del cliente.

---

## Fase 3 — Robustez

### 3.1 Manejador de errores central + 404
- [x] En `index.js`, al final (después de las rutas):
  ```js
  app.use((req, res) => res.status(404).json({ success: false, error: 'Ruta no encontrada' }));
  app.use((err, req, res, next) => {
      console.error(err);
      res.status(err.status || 500).json({ success: false, error: 'Error interno del servidor' });
  });
  ```

### 3.2 Registrar el stack completo en los `catch`
- [x] Cambiar `console.error('...', error.message)` por `console.error('...', error)` en los controladores (y añadir logging en los `catch` de `auth.controller.js` que tragaban el error en silencio).

### 3.3 Validar existencia del componente antes de agregar favorito
- [x] Añadido `ComponenteModel.existe(componenteId)` y comprobación en `agregarFavorito` → responde 404 si no existe (evita el 500 por `FOREIGN KEY`).

### 3.4 Validar `componenteId` numérico
- [x] Añadido `param('componenteId').isInt({ min: 1 }).toInt()` en las rutas POST/DELETE de favoritos (con el mismo middleware `validar` que usa `auth.routes.js`).

### 3.5 `buscarPorEmail` sin `SELECT *`
- [x] En `src/models/usuario.model.js`, seleccionar columnas explícitas:
  ```js
  'SELECT id, nombre, email, password FROM usuarios WHERE email = ?'
  ```

---

## Fase 4 — Mejoras

### 4.1 Endpoint `GET /api/auth/me`
- [ ] Crear controlador que devuelva el usuario a partir de `req.usuario.id`, protegido con `verificarToken`.

### 4.2 Cierre ordenado del servidor
- [ ] Manejar `SIGINT`/`SIGTERM` cerrando el pool de MySQL (`pool.end()`).

### 4.3 `.env.example`
- [ ] Añadir un `.env.example` versionado con las claves (sin valores reales).

---

## Verificación final

- [ ] `POST /api/auth/register` con email duplicado → 400.
- [ ] `POST /api/auth/register` con password corta → 400.
- [ ] `POST /api/auth/login` correcto → token.
- [ ] `GET /api/favoritos` con token → lista del usuario.
- [ ] `POST /api/favoritos/:componenteId` → 201 (y 400 si ya existe).
- [ ] `DELETE /api/favoritos/:componenteId` → 200 (y 404 si no existe).
- [ ] Peticiones sin token → 403; con token inválido → 401.
- [ ] Ruta inexistente → 404 JSON.
