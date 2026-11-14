import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; 

@Component({
  imports: [RouterLink],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  irAGitHub():void{
    window.open('https://github.com/VictorRodBon/libreria-componentes-angular', '_blank', 'noopener,noreferrer')
  }
}
