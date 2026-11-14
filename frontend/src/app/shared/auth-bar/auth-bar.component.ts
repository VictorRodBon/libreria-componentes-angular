import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-bar',
  imports: [RouterLink],
  template: `
    <nav class="bar">
      <a routerLink="/" class="marca">Componentes</a>

      <div class="acciones">
        @if (auth.usuario(); as usuario) {
          <span class="nombre">{{ usuario.nombre }}</span>
          <button type="button" (click)="salir()">Cerrar sesión</button>
        } @else {
          <a routerLink="/login">Iniciar sesión</a>
          <a routerLink="/registro" class="registro">Registrarse</a>
        }
      </div>
    </nav>
  `,
  styles: `
    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px clamp(16px, 4vw, 32px);
      border-bottom: 1px solid var(--border);
    }
    .marca {
      color: var(--text);
      font-weight: 500;
      text-decoration: none;
    }
    .acciones {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 0.875rem;
    }
    .acciones a {
      color: var(--text-2);
      text-decoration: none;
    }
    .acciones a:hover {
      color: var(--text);
    }
    .registro {
      padding: 6px 12px;
      border-radius: 8px;
      background: var(--accent);
      color: #fff !important;
    }
    .nombre {
      color: var(--text-2);
    }
    button {
      padding: 6px 12px;
      border: 1px solid var(--border-strong);
      border-radius: 8px;
      background: none;
      color: var(--text);
      font: inherit;
      cursor: pointer;
    }
  `,
})
export class AuthBarComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}