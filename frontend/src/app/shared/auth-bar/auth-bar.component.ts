import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-bar',
  imports: [RouterLink],
  templateUrl: `./auth-bar.html`,
  styleUrl: `./auth-bar.css`,
})
export class AuthBarComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}