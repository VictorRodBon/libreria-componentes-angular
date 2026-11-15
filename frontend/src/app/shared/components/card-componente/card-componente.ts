import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../examples/card/card.component';
import { ComponenteTarjeta } from '../../../core/models/catalogo.model';
import { FavButtonComponent } from '../fav-button/fav-button.component';

/**
 * Tarjeta con la información de un componente del catálogo.
 *
 * Recibe el componente y el slug de su categoría para poder enlazar
 * al detalle: /docs/:categoriaSlug/:selector
 */
@Component({
  imports: [RouterLink, CardComponent, FavButtonComponent],
  selector: 'app-card-componente',
  styleUrl: './card-componente.css',
  templateUrl: './card-componente.html',
})
export class CardComponente {
  readonly componente = input.required<ComponenteTarjeta>();
  readonly categoriaSlug = input.required<string>();
}