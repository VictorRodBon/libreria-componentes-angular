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
    CONSTRAINT uq_componentes_selector UNIQUE (selector),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- 3. Tabla de Ejemplos de Código (HTML/TS para las demos del frontend)
CREATE TABLE IF NOT EXISTS ejemplos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    componente_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    codigo_html TEXT,
    codigo_ts TEXT,
    demo_key VARCHAR(100) NULL,
    orden INT DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ejemplos_componente_orden (componente_id, orden),
    FOREIGN KEY (componente_id) REFERENCES componentes(id) ON DELETE CASCADE
);

-- 4. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    componente_id INT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_favoritos_usuario_componente UNIQUE (usuario_id, componente_id),
    INDEX idx_favoritos_usuario_creado (usuario_id, creado_en),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (componente_id) REFERENCES componentes(id) ON DELETE CASCADE
);

-- =========================================================
-- DATOS DE PRUEBA (Inicialización)
-- NOTA: pensado para una base de datos nueva; los INSERT no son idempotentes.
-- =========================================================

INSERT INTO categorias (nombre, slug, descripcion) VALUES
('Form Controls', 'form-controls', 'Componentes para la captura y validación de formularios.'),
('Layout', 'layout', 'Componentes para la estructura de la página.'),
('Navigation', 'navigation', 'Componentes para moverse entre vistas y secciones.'),
('Feedback', 'feedback', 'Componentes para comunicar estados, errores y progreso.'),
('Data Display', 'data-display', 'Componentes para presentar información estructurada.'),
('Overlays', 'overlays', 'Componentes flotantes sobre el contenido principal.');

-- Componentes: la categoría se resuelve por slug para no depender de IDs fijos
INSERT INTO componentes (categoria_id, nombre, selector, descripcion)
SELECT c.id, d.nombre, d.selector, d.descripcion
FROM (
            SELECT 'form-controls' AS categoria_slug, 'Button' AS nombre, 'app-button' AS selector, 'Botón interactivo personalizable con múltiples variantes visuales.' AS descripcion
  UNION ALL SELECT 'form-controls', 'Input', 'app-input', 'Campo de texto con etiqueta, placeholder y validación.'
  UNION ALL SELECT 'form-controls', 'Checkbox', 'app-checkbox', 'Casilla de verificación para seleccionar una o varias opciones.'
  UNION ALL SELECT 'form-controls', 'Radio Group', 'app-radio-group', 'Grupo de botones de opción para seleccionar un único valor.'
  UNION ALL SELECT 'form-controls', 'Select', 'app-select', 'Lista desplegable para elegir un valor entre varias opciones.'
  UNION ALL SELECT 'form-controls', 'Switch', 'app-switch', 'Interruptor de activación para estados booleanos.'
  UNION ALL SELECT 'form-controls', 'Textarea', 'app-textarea', 'Área de texto multilínea para contenido extenso.'
  UNION ALL SELECT 'layout', 'Card', 'app-card', 'Contenedor flexible para mostrar contenido estructurado.'
  UNION ALL SELECT 'layout', 'Grid', 'app-grid', 'Sistema de rejilla configurable para organizar contenido.'
  UNION ALL SELECT 'layout', 'Container', 'app-container', 'Contenedor con ancho máximo y centrado automático.'
  UNION ALL SELECT 'layout', 'Divider', 'app-divider', 'Separador visual entre secciones de contenido.'
  UNION ALL SELECT 'layout', 'Stack', 'app-stack', 'Disposición flexible en fila o columna con espaciado uniforme.'
  UNION ALL SELECT 'navigation', 'Navbar', 'app-navbar', 'Barra de navegación superior con marca y enlaces.'
  UNION ALL SELECT 'navigation', 'Tabs', 'app-tabs', 'Pestañas para alternar entre vistas relacionadas.'
  UNION ALL SELECT 'navigation', 'Breadcrumb', 'app-breadcrumb', 'Ruta de migas de pan para indicar la ubicación actual.'
  UNION ALL SELECT 'navigation', 'Pagination', 'app-pagination', 'Controles para navegar entre páginas de resultados.'
  UNION ALL SELECT 'feedback', 'Alert', 'app-alert', 'Mensaje de estado para informar, advertir o mostrar errores.'
  UNION ALL SELECT 'feedback', 'Toast', 'app-toast', 'Notificación flotante temporal para eventos rápidos.'
  UNION ALL SELECT 'feedback', 'Spinner', 'app-spinner', 'Indicador animado de carga en curso.'
  UNION ALL SELECT 'feedback', 'Progress Bar', 'app-progress-bar', 'Barra que representa el progreso de una tarea.'
  UNION ALL SELECT 'data-display', 'Table', 'app-table', 'Tabla de datos configurable con columnas y filas.'
  UNION ALL SELECT 'data-display', 'Badge', 'app-badge', 'Etiqueta compacta para estados o contadores.'
  UNION ALL SELECT 'data-display', 'Avatar', 'app-avatar', 'Imagen o iniciales que representan a un usuario.'
  UNION ALL SELECT 'data-display', 'Accordion', 'app-accordion', 'Paneles plegables para agrupar contenido.'
  UNION ALL SELECT 'overlays', 'Modal', 'app-modal', 'Ventana superpuesta para confirmaciones o formularios.'
  UNION ALL SELECT 'overlays', 'Tooltip', 'app-tooltip', 'Texto de ayuda que aparece al pasar el cursor.'
  UNION ALL SELECT 'overlays', 'Dropdown', 'app-dropdown', 'Menú desplegable con una lista de acciones.'
) AS d
JOIN categorias AS c ON c.slug = d.categoria_slug;

-- Ejemplos: el componente se resuelve por selector para no depender de IDs fijos.
-- demo_key enlaza con el registro de demos del frontend; NULL = solo se muestra el código.
INSERT INTO ejemplos (componente_id, titulo, codigo_html, codigo_ts, orden, demo_key)
SELECT co.id, d.titulo, d.codigo_html, d.codigo_ts, d.orden, d.demo_key
FROM (
            SELECT 'app-button' AS selector, 'Botón primario' AS titulo, '<app-button color="primary">Guardar</app-button>' AS codigo_html, 'export class ButtonExample {}' AS codigo_ts, 1 AS orden, 'button-primary' AS demo_key
  UNION ALL SELECT 'app-button', 'Botón secundario', '<app-button color="secondary">Cancelar</app-button>', 'export class ButtonExample {}', 2, 'button-secondary'
  UNION ALL SELECT 'app-input', 'Input con etiqueta', '<app-input label="Nombre" placeholder="Escribe tu nombre" [(value)]="nombre"></app-input>', 'export class InputExample { nombre = ""; }', 1, NULL
  UNION ALL SELECT 'app-checkbox', 'Checkbox de aceptación', '<app-checkbox label="Acepto los términos" [(checked)]="aceptado"></app-checkbox>', 'export class CheckboxExample { aceptado = false; }', 1, NULL
  UNION ALL SELECT 'app-radio-group', 'Grupo de opciones', '<app-radio-group [options]="opciones" [(value)]="seleccion"></app-radio-group>', 'export class RadioExample { seleccion = "a"; opciones = [{ label: "Opción A", value: "a" }, { label: "Opción B", value: "b" }]; }', 1, NULL
  UNION ALL SELECT 'app-select', 'Selector de país', '<app-select label="País" [options]="paises" [(value)]="pais"></app-select>', 'export class SelectExample { pais = "ES"; paises = ["España", "México", "Argentina"]; }', 1, NULL
  UNION ALL SELECT 'app-switch', 'Modo oscuro', '<app-switch label="Modo oscuro" [(checked)]="oscuro"></app-switch>', 'export class SwitchExample { oscuro = false; }', 1, NULL
  UNION ALL SELECT 'app-textarea', 'Área de comentario', '<app-textarea label="Comentario" [rows]="4" [(value)]="comentario"></app-textarea>', 'export class TextareaExample { comentario = ""; }', 1, NULL
  UNION ALL SELECT 'app-card', 'Tarjeta básica', '<app-card titulo="Resumen" subtitulo="Últimos movimientos"><p>Contenido de la tarjeta.</p></app-card>', 'export class CardExample {}', 1, NULL
  UNION ALL SELECT 'app-grid', 'Rejilla de tres columnas', '<app-grid [columns]="3" gap="1rem"><div>1</div><div>2</div><div>3</div></app-grid>', 'export class GridExample {}', 1, NULL
  UNION ALL SELECT 'app-container', 'Contenedor centrado', '<app-container size="lg"><p>Contenido centrado con ancho máximo.</p></app-container>', 'export class ContainerExample {}', 1, NULL
  UNION ALL SELECT 'app-divider', 'Separador con etiqueta', '<app-divider label="Sección"></app-divider>', 'export class DividerExample {}', 1, NULL
  UNION ALL SELECT 'app-stack', 'Pila horizontal', '<app-stack direction="row" gap="0.5rem"><app-button>Uno</app-button><app-button>Dos</app-button></app-stack>', 'export class StackExample {}', 1, NULL
  UNION ALL SELECT 'app-navbar', 'Barra de navegación', '<app-navbar marca="Mi Librería" [items]="items"></app-navbar>', 'export class NavbarExample { items = [{ label: "Inicio", url: "/" }, { label: "Componentes", url: "/componentes" }]; }', 1, NULL
  UNION ALL SELECT 'app-tabs', 'Pestañas básicas', '<app-tabs [tabs]="tabs" [(active)]="activa"></app-tabs>', 'export class TabsExample { activa = "general"; tabs = [{ id: "general", label: "General" }, { id: "api", label: "API" }]; }', 1, NULL
  UNION ALL SELECT 'app-breadcrumb', 'Migas de pan', '<app-breadcrumb [items]="migas"></app-breadcrumb>', 'export class BreadcrumbExample { migas = [{ label: "Inicio", url: "/" }, { label: "Componentes", url: "/componentes" }]; }', 1, NULL
  UNION ALL SELECT 'app-pagination', 'Paginación', '<app-pagination [total]="100" [pageSize]="10" [(page)]="pagina"></app-pagination>', 'export class PaginationExample { pagina = 1; }', 1, NULL
  UNION ALL SELECT 'app-alert', 'Alerta de éxito', '<app-alert type="success" message="Cambios guardados correctamente."></app-alert>', 'export class AlertExample {}', 1, NULL
  UNION ALL SELECT 'app-toast', 'Notificación temporal', '<app-toast type="info" message="Nueva versión disponible" [duration]="4000"></app-toast>', 'export class ToastExample {}', 1, NULL
  UNION ALL SELECT 'app-spinner', 'Indicador de carga', '<app-spinner size="md"></app-spinner>', 'export class SpinnerExample {}', 1, NULL
  UNION ALL SELECT 'app-progress-bar', 'Progreso de tarea', '<app-progress-bar [value]="65" label="Cargando..."></app-progress-bar>', 'export class ProgressBarExample {}', 1, NULL
  UNION ALL SELECT 'app-table', 'Tabla de datos', '<app-table [columns]="columnas" [data]="filas"></app-table>', 'export class TableExample { columnas = [{ key: "nombre", label: "Nombre" }]; filas = [{ nombre: "Button" }]; }', 1, NULL
  UNION ALL SELECT 'app-badge', 'Etiqueta de estado', '<app-badge color="success">Activo</app-badge>', 'export class BadgeExample {}', 1, NULL
  UNION ALL SELECT 'app-avatar', 'Avatar de usuario', '<app-avatar src="assets/avatar.png" alt="Laura Gómez" size="lg"></app-avatar>', 'export class AvatarExample {}', 1, NULL
  UNION ALL SELECT 'app-accordion', 'Paneles plegables', '<app-accordion [items]="secciones"></app-accordion>', 'export class AccordionExample { secciones = [{ titulo: "¿Qué es?", contenido: "Una librería de componentes." }]; }', 1, NULL
  UNION ALL SELECT 'app-modal', 'Modal de confirmación', '<app-modal [(open)]="abierto" titulo="Confirmar acción"><p>¿Seguro que quieres continuar?</p></app-modal>', 'export class ModalExample { abierto = false; }', 1, NULL
  UNION ALL SELECT 'app-tooltip', 'Tooltip de ayuda', '<app-tooltip texto="Más información"><app-button>?</app-button></app-tooltip>', 'export class TooltipExample {}', 1, NULL
  UNION ALL SELECT 'app-dropdown', 'Menú de acciones', '<app-dropdown [items]="opciones" label="Acciones"></app-dropdown>', 'export class DropdownExample { opciones = ["Editar", "Duplicar", "Eliminar"]; }', 1, NULL
) AS d
JOIN componentes AS co ON co.selector = d.selector;