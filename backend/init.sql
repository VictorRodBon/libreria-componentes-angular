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
    UNION ALL SELECT 'form-controls', 'Switch', 'app-switch', 'Interruptor de activación para estados booleanos.'
    UNION ALL SELECT 'layout', 'Card', 'app-card', 'Contenedor flexible para mostrar contenido estructurado.'
    UNION ALL SELECT 'navigation', 'Tabs', 'app-tabs', 'Pestañas para alternar entre vistas relacionadas.'
    UNION ALL SELECT 'feedback', 'Alert', 'app-alert', 'Mensaje de estado para informar, advertir o mostrar errores.'
    UNION ALL SELECT 'feedback', 'Spinner', 'app-spinner', 'Indicador animado de carga en curso.'
    UNION ALL SELECT 'data-display', 'Badge', 'app-badge', 'Etiqueta compacta para estados o contadores.'
    UNION ALL SELECT 'overlays', 'Modal', 'app-modal', 'Ventana superpuesta para confirmaciones o formularios.'
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
                 '<app-input\n  label="Nombre completo"\n  placeholder="Ej. Ana Pérez"\n  [required]="true"\n  [(value)]="nombre"\n  (submitted)="enviar($event)">\n</app-input>', 
                 'import { Component, signal } from ''@angular/core'';\nimport { InputComponent } from ''./input.component'';\n\n@Component({\n  selector: ''app-input-example'',\n  imports: [InputComponent],\n  templateUrl: ''./input-example.html'',\n})\nexport class InputExample {\n  readonly nombre = signal('''');\n\n  enviar(texto: string): void {\n    console.log(''Enviado:'', texto);\n  }\n}' AS codigo_ts,
                 'app-input {\n  max-width: 320px;\n}' AS codigo_css, 
                 1, 'input-labeled'

    UNION ALL SELECT 'app-checkbox', 'Checkbox de aceptación', 
                 '<app-checkbox\n  label="Acepto los términos y condiciones"\n  [(checked)]="aceptado"\n  (changed)="alCambiar($event)">\n</app-checkbox>\n<app-button [disabled]="!aceptado()">Continuar</app-button>', 
                 'import { Component, signal } from ''@angular/core'';\nimport { CheckboxComponent } from ''./checkbox.component'';\nimport { ButtonComponent } from ''./button.component'';\n\n@Component({\n  selector: ''app-checkbox-example'',\n  imports: [CheckboxComponent, ButtonComponent],\n  templateUrl: ''./checkbox-example.html'',\n})\nexport class CheckboxExample {\n  readonly aceptado = signal(false);\n\n  alCambiar(estado: boolean): void {\n    console.log(''Checkbox:'', estado);\n  }\n}' AS codigo_ts,
                 'app-checkbox {\n  display: block;\n  margin-bottom: 1rem;\n}' AS codigo_css, 
                 1, 'checkbox-acceptance'

    UNION ALL SELECT 'app-switch', 'Modo oscuro', 
                 '<app-switch\n  label="Activar modo oscuro"\n  size="md"\n  [(checked)]="modoOscuro"\n  (changed)="alCambiar($event)">\n</app-switch>', 
                 'import { Component, signal } from ''@angular/core'';\nimport { SwitchComponent } from ''./switch.component'';\n\n@Component({\n  selector: ''app-switch-example'',\n  imports: [SwitchComponent],\n  templateUrl: ''./switch-example.html'',\n})\nexport class SwitchExample {\n  readonly modoOscuro = signal(true);\n\n  alCambiar(activo: boolean): void {\n    console.log(''Modo oscuro:'', activo);\n  }\n}' AS codigo_ts,
                 'app-switch {\n  display: inline-block;\n}' AS codigo_css, 
                 1, 'switch-dark-mode'

    UNION ALL SELECT 'app-card', 'Tarjeta básica', 
                 '<app-card titulo="Análisis Financiero" subtitulo="Cierre Q3">\n  <p>Los ingresos netos aumentaron un 14% respecto al trimestre anterior.</p>\n  <div footer>\n    <app-button color="primary">Ver detalles</app-button>\n  </div>\n</app-card>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-card-example'',\n  templateUrl: ''./card-example.component.html''\n})\nexport class CardExampleComponent {}' AS codigo_ts,
                 'app-card {\n  max-width: 400px;\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n  border-radius: 8px;\n}' AS codigo_css, 
                 1, 'card-basic'

    UNION ALL SELECT 'app-tabs', 'Pestañas básicas', 
                 '<app-tabs [tabs]="listaTabs" [(active)]="pestanaActiva"></app-tabs>\n<div [ngSwitch]="pestanaActiva">\n  <div *ngSwitchCase="''general''">Contenido de General</div>\n  <div *ngSwitchCase="''config''">Contenido de Configuración</div>\n</div>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-tabs-example'',\n  templateUrl: ''./tabs-example.component.html''\n})\nexport class TabsExampleComponent {\n  pestanaActiva = ''general'';\n  listaTabs = [\n    { id: ''general'', label: ''General'' },\n    { id: ''config'', label: ''Configuración'' }\n  ];\n}' AS codigo_ts,
                 'app-tabs {\n  margin-bottom: 1rem;\n}' AS codigo_css, 
                 1, 'tabs-basic'

    UNION ALL SELECT 'app-alert', 'Alerta de éxito', 
                 '<app-alert type="success" titulo="¡Operación exitosa!">Los cambios se han guardado en la base de datos correctamente.</app-alert>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-alert-example'',\n  templateUrl: ''./alert-example.component.html''\n})\nexport class AlertExampleComponent {}' AS codigo_ts,
                 'app-alert {\n  display: block;\n  margin-bottom: 1rem;\n}' AS codigo_css, 
                 1, 'alert-success'

    UNION ALL SELECT 'app-spinner', 'Indicador de carga', 
                 '<app-spinner size="lg" color="primary"></app-spinner>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-spinner-example'',\n  templateUrl: ''./spinner-example.component.html''\n})\nexport class SpinnerExampleComponent {}' AS codigo_ts,
                 'app-spinner {\n  display: inline-block;\n  margin: 1rem;\n}' AS codigo_css, 
                 1, 'spinner-loading'

    UNION ALL SELECT 'app-badge', 'Etiqueta de estado', 
                 '<app-badge color="success" variant="subtle">Activo</app-badge>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-badge-example'',\n  templateUrl: ''./badge-example.component.html''\n})\nexport class BadgeExampleComponent {}' AS codigo_ts,
                 'app-badge {\n  display: inline-block;\n}' AS codigo_css, 
                 1, 'badge-status'

    UNION ALL SELECT 'app-modal', 'Modal de confirmación', 
                 '<app-modal [(open)]="modalAbierto" titulo="¿Estás seguro?">\n  <p>Esta acción no se puede deshacer y eliminará permanentemente el registro.</p>\n  <div footer>\n    <app-button color="secondary" (click)="modalAbierto = false">Cancelar</app-button>\n    <app-button color="danger">Eliminar</app-button>\n  </div>\n</app-modal>', 
                 'import { Component } from ''@angular/core'';\n\n@Component({\n  selector: ''app-modal-example'',\n  templateUrl: ''./modal-example.component.html''\n})\nexport class ModalExampleComponent {\n  modalAbierto = false;\n}' AS codigo_ts,
                 'app-modal {\n  z-index: 1000;\n}' AS codigo_css, 
                 1, 'modal-confirmation'
) AS d
JOIN componentes AS co ON co.selector = d.selector
WHERE NOT EXISTS (
    SELECT 1 FROM ejemplos e 
    WHERE e.componente_id = co.id AND e.titulo = d.titulo
);