import { Component } from '@angular/core';
import { Location } from '@angular/common'


/** Botón "Atrás": vuelve a la página anterior del historial del navegador. */
@Component({
  imports: [],
  selector: 'app-btn-atras',
  styleUrl: './btn-atras.css',
  templateUrl: './btn-atras.html',
})
export class BtnAtras {
  constructor(private location: Location){}
  /** Navega a la página anterior. */
  goBack():void{
    this.location.back()
  }
}
