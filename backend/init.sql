-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS ComponentesDB 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE ComponentesDB;

-- 1. Tabla de Categorías
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Componentes
CREATE TABLE IF NOT EXISTS componentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    selector VARCHAR(100) NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_componentes_selector UNIQUE (selector),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla de Ejemplos de Código (HTML, TS, CSS y demo_key reales)
CREATE TABLE IF NOT EXISTS ejemplos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    componente_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    codigo_html TEXT,
    codigo_ts TEXT,
    codigo_css TEXT,
    demo_key VARCHAR(100) NULL,
    orden INT DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ejemplos_componente_orden (componente_id, orden),
    FOREIGN KEY (componente_id) REFERENCES componentes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- DATOS DE PRUEBA (Idempotentes / Reejecutables)
-- =========================================================

-- Categorías
INSERT INTO categorias (nombre, slug, descripcion) VALUES
('Form Controls', 'form-controls', 'Componentes para la captura y validación de formularios.'),
('Layout', 'layout', 'Componentes para la estructura de la página.'),
('Navigation', 'navigation', 'Componentes para moverse entre vistas y secciones.'),
('Feedback', 'feedback', 'Componentes para comunicar estados, errores y progreso.'),
('Data Display', 'data-display', 'Componentes para presentar información estructurada.'),
('Overlays', 'overlays', 'Componentes flotantes sobre el contenido principal.')
ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre), 
    descripcion = VALUES(descripcion);

-- Componentes
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
JOIN categorias AS c ON c.slug = d.categoria_slug
ON DUPLICATE KEY UPDATE 
    categoria_id = VALUES(categoria_id), 
    nombre = VALUES(nombre), 
    descripcion = VALUES(descripcion);

-- Ejemplos con código HTML, TS, CSS y demo_key generados
INSERT INTO ejemplos (componente_id, titulo, codigo_html, codigo_ts, codigo_css, orden, demo_key)
SELECT co.id, d.titulo, d.codigo_html, d.codigo_ts, d.codigo_css, d.orden, d.demo_key
FROM (
          SELECT 'app-button' AS selector, 'Botón primario' AS titulo, 
                 '<app-button color="primary" size="md" (click)="onClick()">\n  <mat-icon>save</mat-icon>\n  <span>Guardar Cambios</span>\n</app-button>' AS codigo_html, 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-button-primary-example'',\n  templateUrl: ''./button-primary.component.html''\n})\nexport class ButtonPrimaryExample {\n  onClick(): void {\n    console.log(''Botón primario presionado'');\n  }\n}' AS codigo_ts,
                 'app-button {\n  display: inline-block;\n  margin: 0.5rem;\n}' AS codigo_css, 
                 1 AS orden, 'button-primary' AS demo_key

    UNION ALL SELECT 'app-button', 'Botón secundario', 
                 '<app-button color="secondary" [disabled]="isLoading">\n  Cancelar\n</app-button>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-button-secondary-example'',\n  templateUrl: ''./button-secondary.component.html''\n})\nexport class ButtonSecondaryExample {\n  isLoading = false;\n}' AS codigo_ts,
                 'app-button {\n  margin: 0.5rem;\n}' AS codigo_css, 
                 2, 'button-secondary'

    UNION ALL SELECT 'app-input', 'Input con etiqueta', 
                 '<div class="field-wrapper">\n  <app-input label="Nombre completo" placeholder="Ej. Ana Pérez" [(value)]="nombre" [required]="true"></app-input>\n  <span class="helper-text">Introduce tu nombre legal.</span>\n</div>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-input-example'',\n  templateUrl: ''./input-example.component.html''\n})\nexport class InputExampleComponent {\n  nombre: string = '''';\n}' AS codigo_ts,
                 '.field-wrapper {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n  width: 100%;\n  max-width: 320px;\n}\n.helper-text {\n  font-size: 0.8rem;\n  color: #666;\n}' AS codigo_css, 
                 1, 'input-labeled'

    UNION ALL SELECT 'app-checkbox', 'Checkbox de aceptación', 
                 '<app-checkbox label="Acepto los términos y condiciones" [(checked)]="aceptado" (change)="onToggle($event)"></app-checkbox>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-checkbox-example'',\n  templateUrl: ''./checkbox-example.component.html''\n})\nexport class CheckboxExampleComponent {\n  aceptado: boolean = false;\n  onToggle(estado: boolean) {\n    console.log(''Estado del checkbox:'', estado);\n  }\n}' AS codigo_ts,
                 'app-checkbox {\n  display: block;\n  margin: 1rem 0;\n}' AS codigo_css, 
                 1, 'checkbox-acceptance'

    UNION ALL SELECT 'app-radio-group', 'Grupo de opciones', 
                 '<app-radio-group label="Seleccione un plan" [options]="opciones" [(value)]="seleccion"></app-radio-group>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-radio-example'',\n  templateUrl: ''./radio-example.component.html''\n})\nexport class RadioExampleComponent {\n  seleccion = ''free'';\n  opciones = [\n    { label: ''Plan Gratuito'', value: ''free'' },\n    { label: ''Plan Pro ($9/mes)'', value: ''pro'' }\n  ];\n}' AS codigo_ts,
                 'app-radio-group {\n  display: block;\n  padding: 0.5rem 0;\n}' AS codigo_css, 
                 1, 'radio-group-options'

    UNION ALL SELECT 'app-select', 'Selector de país', 
                 '<app-select label="País de residencia" [options]="paises" [(value)]="paisSelected" placeholder="Seleccione..."></app-select>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-select-example'',\n  templateUrl: ''./select-example.component.html''\n})\nexport class SelectExampleComponent {\n  paisSelected = ''ES'';\n  paises = [\n    { label: ''España'', value: ''ES'' },\n    { label: ''México'', value: ''MX'' },\n    { label: ''Argentina'', value: ''AR'' }\n  ];\n}' AS codigo_ts,
                 'app-select {\n  width: 100%;\n  max-width: 300px;\n}' AS codigo_css, 
                 1, 'select-country'

    UNION ALL SELECT 'app-switch', 'Modo oscuro', 
                 '<app-switch label="Activar modo oscuro" [(checked)]="modoOscuro"></app-switch>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-switch-example'',\n  templateUrl: ''./switch-example.component.html''\n})\nexport class SwitchExampleComponent {\n  modoOscuro: boolean = false;\n}' AS codigo_ts,
                 'app-switch {\n  display: inline-flex;\n  align-items: center;\n}' AS codigo_css, 
                 1, 'switch-dark-mode'

    UNION ALL SELECT 'app-textarea', 'Área de comentario', 
                 '<app-textarea label="Escribe tu mensaje" [rows]="4" [maxLength]="250" [(value)]="comentario"></app-textarea>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-textarea-example'',\n  templateUrl: ''./textarea-example.component.html''\n})\nexport class TextareaExampleComponent {\n  comentario: string = '''';\n}' AS codigo_ts,
                 'app-textarea {\n  width: 100%;\n  display: block;\n}' AS codigo_css, 
                 1, 'textarea-comment'

    UNION ALL SELECT 'app-card', 'Tarjeta básica', 
                 '<app-card titulo="Análisis Financiero" subtitulo="Cierre Q3">\n  <p>Los ingresos netos aumentaron un 14% respecto al trimestre anterior.</p>\n  <div footer>\n    <app-button color="primary">Ver detalles</app-button>\n  </div>\n</app-card>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-card-example'',\n  templateUrl: ''./card-example.component.html''\n})\nexport class CardExampleComponent {}' AS codigo_ts,
                 'app-card {\n  max-width: 400px;\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n  border-radius: 8px;\n}' AS codigo_css, 
                 1, 'card-basic'

    UNION ALL SELECT 'app-grid', 'Rejilla de tres columnas', 
                 '<app-grid [columns]="3" gap="1.5rem">\n  <div class="grid-item">Columna 1</div>\n  <div class="grid-item">Columna 2</div>\n  <div class="grid-item">Columna 3</div>\n</app-grid>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-grid-example'',\n  templateUrl: ''./grid-example.component.html''\n})\nexport class GridExampleComponent {}' AS codigo_ts,
                 '.grid-item {\n  background: #f0f4f8;\n  padding: 1.5rem;\n  text-align: center;\n  border-radius: 4px;\n}' AS codigo_css, 
                 1, 'grid-three-columns'

    UNION ALL SELECT 'app-container', 'Contenedor centrado', 
                 '<app-container size="lg">\n  <h1>Contenido Principal</h1>\n  <p>Este bloque está limitado en anchura y perfectamente centrado en pantallas grandes.</p>\n</app-container>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-container-example'',\n  templateUrl: ''./container-example.component.html''\n})\nexport class ContainerExampleComponent {}' AS codigo_ts,
                 'app-container {\n  background: #ffffff;\n  padding: 2rem;\n  border: 1px solid #e2e8f0;\n}' AS codigo_css, 
                 1, 'container-centered'

    UNION ALL SELECT 'app-divider', 'Separador con etiqueta', 
                 '<div class="content-block">\n  <p>Sección superior</p>\n  <app-divider label="O continúa con" align="center"></app-divider>\n  <p>Sección inferior</p>\n</div>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-divider-example'',\n  templateUrl: ''./divider-example.component.html''\n})\nexport class DividerExampleComponent {}' AS codigo_ts,
                 '.content-block {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}' AS codigo_css, 
                 1, 'divider-labeled'

    UNION ALL SELECT 'app-stack', 'Pila horizontal', 
                 '<app-stack direction="row" gap="1rem" align="center">\n  <app-button color="primary">Aceptar</app-button>\n  <app-button color="secondary">Rechazar</app-button>\n</app-stack>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-stack-example'',\n  templateUrl: ''./stack-example.component.html''\n})\nexport class StackExampleComponent {}' AS codigo_ts,
                 'app-stack {\n  padding: 0.5rem;\n}' AS codigo_css, 
                 1, 'stack-horizontal'

    UNION ALL SELECT 'app-navbar', 'Barra de navegación', 
                 '<app-navbar marca="TechPortal" [items]="navItems">\n  <div actions>\n    <app-button size="sm">Perfil</app-button>\n  </div>\n</app-navbar>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-navbar-example'',\n  templateUrl: ''./navbar-example.component.html''\n})\nexport class NavbarExampleComponent {\n  navItems = [\n    { label: ''Inicio'', url: ''/'' },\n    { label: ''Componentes'', url: ''/componentes'' },\n    { label: ''Documentación'', url: ''/docs'' }\n  ];\n}' AS codigo_ts,
                 'app-navbar {\n  background: #1e293b;\n  color: white;\n}' AS codigo_css, 
                 1, 'navbar-basic'

    UNION ALL SELECT 'app-tabs', 'Pestañas básicas', 
                 '<app-tabs [tabs]="listaTabs" [(active)]="pestanaActiva"></app-tabs>\n<div [ngSwitch]="pestanaActiva">\n  <div *ngSwitchCase="''general''">Contenido de General</div>\n  <div *ngSwitchCase="''config''">Contenido de Configuración</div>\n</div>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-tabs-example'',\n  templateUrl: ''./tabs-example.component.html''\n})\nexport class TabsExampleComponent {\n  pestanaActiva = ''general'';\n  listaTabs = [\n    { id: ''general'', label: ''General'' },\n    { id: ''config'', label: ''Configuración'' }\n  ];\n}' AS codigo_ts,
                 'app-tabs {\n  margin-bottom: 1rem;\n}' AS codigo_css, 
                 1, 'tabs-basic'

    UNION ALL SELECT 'app-breadcrumb', 'Migas de pan', 
                 '<app-breadcrumb [items]="rutas"></app-breadcrumb>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-breadcrumb-example'',\n  templateUrl: ''./breadcrumb-example.component.html''\n})\nexport class BreadcrumbExampleComponent {\n  rutas = [\n    { label: ''Home'', url: ''/'' },\n    { label: ''Catálogo'', url: ''/catalogo'' },\n    { label: ''Detalle'', url: '''' }\n  ];\n}' AS codigo_ts,
                 'app-breadcrumb {\n  font-size: 0.9rem;\n}' AS codigo_css, 
                 1, 'breadcrumb-routes'

    UNION ALL SELECT 'app-pagination', 'Paginación', 
                 '<app-pagination [total]="120" [pageSize]="10" [(page)]="paginaActual" (pageChange)="cambiarPagina($event)"></app-pagination>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-pagination-example'',\n  templateUrl: ''./pagination-example.component.html''\n})\nexport class PaginationExampleComponent {\n  paginaActual = 1;\n  cambiarPagina(p: number) {\n    console.log(''Cambiando a página:'', p);\n  }\n}' AS codigo_ts,
                 'app-pagination {\n  margin-top: 1.5rem;\n}' AS codigo_css, 
                 1, 'pagination-basic'

    UNION ALL SELECT 'app-alert', 'Alerta de éxito', 
                 '<app-alert type="success" title="¡Operación exitosa!" message="Los cambios se han guardado en la base de datos correctamente."></app-alert>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-alert-example'',\n  templateUrl: ''./alert-example.component.html''\n})\nexport class AlertExampleComponent {}' AS codigo_ts,
                 'app-alert {\n  display: block;\n  margin-bottom: 1rem;\n}' AS codigo_css, 
                 1, 'alert-success'

    UNION ALL SELECT 'app-toast', 'Notificación temporal', 
                 '<app-toast type="info" message="Hay una nueva actualización disponible (v2.4.0)" [duration]="5000"></app-toast>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-toast-example'',\n  templateUrl: ''./toast-example.component.html''\n})\nexport class ToastExampleComponent {}' AS codigo_ts,
                 'app-toast {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n}' AS codigo_css, 
                 1, 'toast-notification'

    UNION ALL SELECT 'app-spinner', 'Indicador de carga', 
                 '<app-spinner size="lg" color="primary"></app-spinner>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-spinner-example'',\n  templateUrl: ''./spinner-example.component.html''\n})\nexport class SpinnerExampleComponent {}' AS codigo_ts,
                 'app-spinner {\n  display: inline-block;\n  margin: 1rem;\n}' AS codigo_css, 
                 1, 'spinner-loading'

    UNION ALL SELECT 'app-progress-bar', 'Progreso de tarea', 
                 '<app-progress-bar [value]="75" label="Subiendo archivo..." [showPercentage]="true"></app-progress-bar>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-progress-example'',\n  templateUrl: ''./progress-example.component.html''\n})\nexport class ProgressExampleComponent {\n  progreso = 75;\n}' AS codigo_ts,
                 'app-progress-bar {\n  width: 100%;\n  max-width: 400px;\n  display: block;\n}' AS codigo_css, 
                 1, 'progress-bar-task'

    UNION ALL SELECT 'app-table', 'Tabla de datos', 
                 '<app-table [columns]="columnas" [data]="datos" [pagination]="true"></app-table>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-table-example'',\n  templateUrl: ''./table-example.component.html''\n})\nexport class TableExampleComponent {\n  columnas = [\n    { key: ''id'', label: ''ID'' },\n    { key: ''nombre'', label: ''Componente'' },\n    { key: ''estado'', label: ''Estado'' }\n  ];\n  datos = [\n    { id: 1, nombre: ''Button'', estado: ''Activo'' },\n    { id: 2, nombre: ''Modal'', estado: ''Beta'' }\n  ];\n}' AS codigo_ts,
                 'app-table {\n  width: 100%;\n  border-collapse: collapse;\n}' AS codigo_css, 
                 1, 'table-data'

    UNION ALL SELECT 'app-badge', 'Etiqueta de estado', 
                 '<app-badge color="success" variant="subtle">Activo</app-badge>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-badge-example'',\n  templateUrl: ''./badge-example.component.html''\n})\nexport class BadgeExampleComponent {}' AS codigo_ts,
                 'app-badge {\n  display: inline-block;\n}' AS codigo_css, 
                 1, 'badge-status'

    UNION ALL SELECT 'app-avatar', 'Avatar de usuario', 
                 '<app-avatar src="assets/images/user.jpg" alt="Carlos Ruiz" size="lg" status="online"></app-avatar>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-avatar-example'',\n  templateUrl: ''./avatar-example.component.html''\n})\nexport class AvatarExampleComponent {}' AS codigo_ts,
                 'app-avatar {\n  display: inline-block;\n}' AS codigo_css, 
                 1, 'avatar-user'

    UNION ALL SELECT 'app-accordion', 'Paneles plegables', 
                 '<app-accordion [items]="seccionesAccordion"></app-accordion>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-accordion-example'',\n  templateUrl: ''./accordion-example.component.html''\n})\nexport class AccordionExampleComponent {\n  seccionesAccordion = [\n    { titulo: ''¿Qué es Angular?'', contenido: ''Un framework para aplicaciones web.'' },\n    { titulo: ''¿Qué es una librería?'', contenido: ''Un conjunto reutilizable de componentes.'' }\n  ];\n}' AS codigo_ts,
                 'app-accordion {\n  width: 100%;\n  max-width: 500px;\n}' AS codigo_css, 
                 1, 'accordion-panels'

    UNION ALL SELECT 'app-modal', 'Modal de confirmación', 
                 '<app-modal [(open)]="modalAbierto" titulo="¿Estás seguro?">\n  <p>Esta acción no se puede deshacer y eliminará permanentemente el registro.</p>\n  <div footer>\n    <app-button color="secondary" (click)="modalAbierto = false">Cancelar</app-button>\n    <app-button color="danger">Eliminar</app-button>\n  </div>\n</app-modal>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-modal-example'',\n  templateUrl: ''./modal-example.component.html''\n})\nexport class ModalExampleComponent {\n  modalAbierto = false;\n}' AS codigo_ts,
                 'app-modal {\n  z-index: 1000;\n}' AS codigo_css, 
                 1, 'modal-confirmation'

    UNION ALL SELECT 'app-tooltip', 'Tooltip de ayuda', 
                 '<app-tooltip text="Haga clic para obtener ayuda adicional" position="top">\n  <app-button>?</app-button>\n</app-tooltip>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-tooltip-example'',\n  templateUrl: ''./tooltip-example.component.html''\n})\nexport class TooltipExampleComponent {}' AS codigo_ts,
                 'app-tooltip {\n  display: inline-block;\n}' AS codigo_css, 
                 1, 'tooltip-help'

    UNION ALL SELECT 'app-dropdown', 'Menú de acciones', 
                 '<app-dropdown label="Opciones" [items]="opcionesDropdown" (select)="onSelect($event)"></app-dropdown>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-dropdown-example'',\n  templateUrl: ''./dropdown-example.component.html''\n})\nexport class DropdownExampleComponent {\n  opcionesDropdown = [\n    { label: ''Editar'', action: ''edit'' },\n    { label: ''Duplicar'', action: ''duplicate'' },\n    { label: ''Eliminar'', action: ''delete'' }\n  ];\n  onSelect(opt: any) {\n    console.log(''Seleccionado:'', opt);\n  }\n}' AS codigo_ts,
                 'app-dropdown {\n  display: inline-block;\n}' AS codigo_css, 
                 1, 'dropdown-actions'
) AS d
JOIN componentes AS co ON co.selector = d.selector
WHERE NOT EXISTS (
    SELECT 1 FROM ejemplos e 
    WHERE e.componente_id = co.id AND e.titulo = d.titulo
);