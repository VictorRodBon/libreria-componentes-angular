import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; 

/** Página de inicio: presentación de la librería y accesos al catálogo y al código fuente. */
@Component({
  imports: [RouterLink],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  /** Abre el repositorio del proyecto en una pestaña nueva. */
  irAGitHub():void{
    window.open('https://github.com/VictorRodBon/libreria-componentes-angular', '_blank', 'noopener,noreferrer')
  }
}
