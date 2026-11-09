-- =========================================================
-- Migración para bases de datos ya creadas
-- Sistema de demos interactivas + favoritos
--
-- Ejecutar una sola vez sobre ComponentesDB:
--   docker compose exec -T db mariadb -uadmin -p'Clave$1' ComponentesDB \
--     < migrations/001_demos_y_favoritos.sql
-- =========================================================

USE ComponentesDB;

-- 1. demo_key: enlaza cada ejemplo con su demo Angular.
--    NULL = el ejemplo solo muestra código, sin demo viva.
ALTER TABLE ejemplos
    ADD COLUMN IF NOT EXISTS demo_key VARCHAR(100) NULL AFTER codigo_ts;

-- 2. Índice para cargar los ejemplos ordenados de un componente.
ALTER TABLE ejemplos
    ADD INDEX IF NOT EXISTS idx_ejemplos_componente_orden (componente_id, orden);

-- 3. El selector identifica unívocamente un componente.
--    Necesario para GET /api/componentes/:selector.
ALTER TABLE componentes
    ADD UNIQUE INDEX IF NOT EXISTS uq_componentes_selector (selector);

-- 4. Un usuario no puede guardar el mismo favorito dos veces.
ALTER TABLE favoritos
    ADD UNIQUE INDEX IF NOT EXISTS uq_favoritos_usuario_componente (usuario_id, componente_id);

-- 5. Índice para listar los favoritos de un usuario por fecha.
ALTER TABLE favoritos
    ADD INDEX IF NOT EXISTS idx_favoritos_usuario_creado (usuario_id, creado_en);

-- 6. Alinear la columna de contraseña con el código (usuario.model.js usa "password").
--    Se hace con SQL dinámico para que la migración sea idempotente.
SET @tiene_contraseña := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'usuarios'
      AND COLUMN_NAME = 'contraseña'
);

SET @tiene_password := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'usuarios'
      AND COLUMN_NAME = 'password'
);

SET @sql := IF(
    @tiene_contraseña > 0 AND @tiene_password = 0,
    'ALTER TABLE usuarios CHANGE COLUMN `contraseña` password VARCHAR(100) NOT NULL',
    'SELECT 1'
);

PREPARE migrar_password FROM @sql;
EXECUTE migrar_password;
DEALLOCATE PREPARE migrar_password;

-- 7. Asignar demo_key a los ejemplos que ya tienen demo implementada en el frontend.
UPDATE ejemplos e
JOIN componentes c ON c.id = e.componente_id
SET e.demo_key = 'button-primary'
WHERE c.selector = 'app-button'
  AND e.titulo = 'Botón primario';

UPDATE ejemplos e
JOIN componentes c ON c.id = e.componente_id
SET e.demo_key = 'button-secondary'
WHERE c.selector = 'app-button'
  AND e.titulo = 'Botón secundario';
