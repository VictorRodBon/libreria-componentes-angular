import { Component } from '@angular/core';
import { Location } from '@angular/common'


@Component({
  imports: [],
  selector: 'app-btn-atras',
  styleUrl: './btn-atras.css',
  templateUrl: './btn-atras.html',
})
export class BtnAtras {
  constructor(private location: Location){}
  goBack():void{
    this.location.back()
  }
}
