import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/**
 * Barra superior fija: enlace a Inicio y "Cómo usar" y, según haya sesión o no,
 * el nombre del usuario con "Cerrar sesión" o los enlaces de login y registro.
 */
@Component({
  selector: 'app-auth-bar',
  imports: [RouterLink],
  templateUrl: `./auth-bar.html`,
  styleUrl: `./auth-bar.css`,
})
export class AuthBarComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Cierra la sesión y vuelve a Inicio. */
  salir(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}