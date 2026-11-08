-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS ComponentesDB;
USE ComponentesDB;

-- 1. Tabla de Categorías (Formularios, Navegación, Layout, etc.)
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Componentes (Button, Card, Input, etc.)
CREATE TABLE IF NOT EXISTS componentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    selector VARCHAR(100) NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- 3. Tabla de Ejemplos de Código (HTML/TS para las demos del frontend)
CREATE TABLE IF NOT EXISTS ejemplos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    componente_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    codigo_html TEXT,
    codigo_ts TEXT,
    orden INT DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (componente_id) REFERENCES componentes(id) ON DELETE CASCADE
);

-- =========================================================
-- DATOS DE PRUEBA (Inicialización)
-- =========================================================

INSERT INTO categorias (nombre, slug, descripcion) VALUES
('Form Controls', 'form-controls', 'Componentes para la captura y validación de formularios.'),
('Layout', 'layout', 'Componentes para la estructura de la página.');

INSERT INTO componentes (categoria_id, nombre, selector, descripcion) VALUES
(1, 'Button', 'app-button', 'Botón interactivo personalizable con múltiples variantes visuales.'),
(2, 'Card', 'app-card', 'Contenedor flexible para mostrar contenido estructurado.');

INSERT INTO ejemplos (componente_id, titulo, codigo_html, codigo_ts, orden) VALUES
(1, 'Botón primario', '<app-button color="primary">Guardar</app-button>', '@Component({...}) export class ButtonExample {}', 1),
(1, 'Botón secundario', '<app-button color="secondary">Cancelar</app-button>', '@Component({...}) export class ButtonExample {}', 2);