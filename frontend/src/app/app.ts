import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthBarComponent } from './shared/auth-bar/auth-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AuthBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}