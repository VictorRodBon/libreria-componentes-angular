import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, mensajeError } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h1>Iniciar sesión</h1>
    <p class="sub">Accede a tu cuenta.</p>

    <form [formGroup]="form" (ngSubmit)="enviar()" novalidate>
      <label for="email">Correo electrónico</label>
      <input
        id="email"
        type="email"
        formControlName="email"
        autocomplete="email"
        [class.invalido]="invalido('email')"
      />
      @if (invalido('email')) {
        <p class="campo-error">Introduce un correo válido.</p>
      }

      <label for="password">Contraseña</label>
      <input
        id="password"
        type="password"
        formControlName="password"
        autocomplete="current-password"
        [class.invalido]="invalido('password')"
      />
      @if (invalido('password')) {
        <p class="campo-error">Introduce tu contraseña.</p>
      }

      @if (error(); as mensaje) {
        <p class="error" role="alert">{{ mensaje }}</p>
      }

      <button type="submit" [disabled]="enviando()">
        {{ enviando() ? 'Entrando…' : 'Entrar' }}
      </button>
    </form>

    <p class="alternativa">¿No tienes cuenta? <a routerLink="/registro">Regístrate</a></p>
  `,
  styleUrl: './auth-form.css',
})
export class LoginComponent {
  /** Llega de ?returnUrl=... gracias a withComponentInputBinding(). Es undefined si no viene en la URL. */
  readonly returnUrl = input<string | undefined>(undefined);

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);

  invalido(campo: 'email' | 'password'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.error.set(null);
    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl(this.destino()),
      error: (err) => {
        this.error.set(mensajeError(err));
        this.enviando.set(false);
      },
    });
  }

  /** Solo rutas internas, para evitar redirecciones a otros sitios. */
  private destino(): string {
    const url = this.returnUrl();
    return url && url.startsWith('/') && !url.startsWith('//') ? url : '/';
  }
}