import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthBarComponent } from './shared/auth-bar/auth-bar.component';
import { LoginModalComponent } from './shared/login-modal/login-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AuthBarComponent, LoginModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}