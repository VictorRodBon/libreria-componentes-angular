import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { CardComponent } from '../card.component';

/**
 * Demo del ejemplo "card-basic": una tarjeta con cabecera, cuerpo y pie,
 * y controles para cambiar sus datos en vivo.
 */
@Component({
  selector: 'app-card-basic-demo',
  imports: [CardComponent, ButtonComponent],
  templateUrl: './card-basic.demo.html',
  styleUrl: './card-basic.demo.css',
})
export class CardBasicDemo {
  readonly titulo = signal('Análisis Financiero');
  readonly subtitulo = signal('Cierre Q3');
  readonly conPie = signal(true);
}
