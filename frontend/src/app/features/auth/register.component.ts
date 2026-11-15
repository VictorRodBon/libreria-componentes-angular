import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService, mensajeError } from '../../core/services/auth.service';

/** Página de registro: crea la cuenta y, si va bien, inicia sesión automáticamente. */
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h1>Crear cuenta</h1>
    <p class="sub">Regístrate para empezar.</p>

    <form [formGroup]="form" (ngSubmit)="enviar()" novalidate>
      <label for="nombre">Nombre</label>
      <input
        id="nombre"
        type="text"
        formControlName="nombre"
        autocomplete="name"
        [class.invalido]="invalido('nombre')"
      />
      @if (invalido('nombre')) {
        <p class="campo-error">Introduce tu nombre (máximo 100 caracteres).</p>
      }

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
        autocomplete="new-password"
        [class.invalido]="invalido('password')"
      />
      @if (invalido('password')) {
        <p class="campo-error">La contraseña debe tener al menos 8 caracteres.</p>
      }

      @if (error(); as mensaje) {
        <p class="error" role="alert">{{ mensaje }}</p>
      }

      <button type="submit" [disabled]="enviando()">
        {{ enviando() ? 'Creando cuenta…' : 'Crear cuenta' }}
      </button>
    </form>

    <p class="alternativa">¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
  `,
  styleUrl: './auth-form.css',
})
export class RegisterComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);

  /** True si el campo es inválido y el usuario ya lo ha tocado (para mostrar el error). */
  invalido(campo: 'nombre' | 'email' | 'password'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  /** Valida el formulario, registra al usuario y después hace login. */
  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.error.set(null);
    const { nombre, email, password } = this.form.getRawValue();

    // El registro no devuelve token: tras crear la cuenta se inicia sesión directamente.
    this.auth
      .registro(nombre, email, password)
      .pipe(switchMap(() => this.auth.login(email, password)))
      .subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (err) => {
          this.error.set(mensajeError(err));
          this.enviando.set(false);
        },
      });
  }
}