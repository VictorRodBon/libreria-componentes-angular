import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../examples/card/card.component';

/** Un paso de la guía de uso. */
interface Paso {
  titulo: string;
  texto: string;
  enlace: string;
  textoEnlace: string;
}

/** Una pregunta frecuente con su respuesta. */
interface Pregunta {
  pregunta: string;
  respuesta: string;
}

/**
 * Página "Cómo usar": guía rápida de la aplicación y preguntas frecuentes.
 *
 * Los pasos se pintan con el componente `app-card` de la librería. Las
 * preguntas funcionan como un acordeón: solo una está abierta a la vez.
 */
@Component({
  selector: 'app-como-usar',
  imports: [RouterLink, CardComponent],
  templateUrl: './como-usar.html',
  styleUrl: './como-usar.css',
})
export class ComoUsar {
  readonly pasos: Paso[] = [
    {
      titulo: '1. Explora el catálogo',
      texto: 'En la barra lateral elige "Todos" o una categoría para ver sus componentes en tarjetas.',
      enlace: '/categoria',
      textoEnlace: 'Ir al catálogo',
    },
    {
      titulo: '2. Prueba la demo',
      texto: 'Pulsa "Ver componente" en una tarjeta. La demo es interactiva: cambia sus opciones y mira el resultado al momento.',
      enlace: '/docs/feedback/app-alert',
      textoEnlace: 'Ver un ejemplo',
    },
    {
      titulo: '3. Copia el código',
      texto: 'Debajo de cada demo, "Ver código" muestra el HTML, el TypeScript y el CSS, con un botón para copiarlo.',
      enlace: '/docs/form-controls/app-button',
      textoEnlace: 'Ver el código de Button',
    },
    {
      titulo: '4. Guarda tus favoritos',
      texto: 'Crea una cuenta e inicia sesión. Después, el corazón de cada componente lo guarda en tu página de Favoritos.',
      enlace: '/registro',
      textoEnlace: 'Crear cuenta',
    },
  ];

  readonly preguntas: Pregunta[] = [
    {
      pregunta: '¿Necesito una cuenta para usar el catálogo?',
      respuesta: 'No. El catálogo, las demos y el código son públicos. La cuenta solo hace falta para guardar favoritos.',
    },
    {
      pregunta: '¿Por qué algunos componentes dicen "Demo no registrada"?',
      respuesta: 'Tabs y Modal aún no tienen demo. Se dejan para mostrar que la página sigue funcionando: se ven su descripción y su código.',
    },
    {
      pregunta: '¿Cómo uso un componente en mi proyecto?',
      respuesta: 'Copia la carpeta del componente (sus ficheros .ts, .html y .css), impórtalo en el componente donde lo quieras usar y escribe su etiqueta, por ejemplo <app-button>.',
    },
  ];

  /** Índice de la pregunta abierta, o null si están todas cerradas. */
  readonly abierta = signal<number | null>(null);

  /** Abre una pregunta; si ya estaba abierta, la cierra. */
  alternar(indice: number): void {
    this.abierta.update((actual) => (actual === indice ? null : indice));
  }
}
