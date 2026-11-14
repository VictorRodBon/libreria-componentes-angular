import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '../api.config';
import { AuthService } from './auth.service';

const RESPUESTA = {
  success: true,
  message: 'ok',
  token: 'TOKEN',
  data: { id: 1, nombre: 'Ana', email: 'a@a.com' },
};

describe('AuthService', () => {
  let servicio: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('al empezar no hay sesión', () => {
    expect(servicio.isLoggedIn()).toBe(false);
    expect(servicio.token).toBeNull();
  });

  it('login guarda el token y el usuario', () => {
    servicio.login({ email: 'a@a.com', password: '12345678' }).subscribe();
    const peticion = http.expectOne(`${API_URL}/auth/login`);
    expect(peticion.request.method).toBe('POST');
    peticion.flush(RESPUESTA);

    expect(servicio.isLoggedIn()).toBe(true);
    expect(servicio.token).toBe('TOKEN');
    expect(servicio.usuario()?.nombre).toBe('Ana');
  });

  it('logout borra la sesión', () => {
    servicio.login({ email: 'a@a.com', password: '12345678' }).subscribe();
    http.expectOne(`${API_URL}/auth/login`).flush(RESPUESTA);

    servicio.logout();

    expect(servicio.isLoggedIn()).toBe(false);
    expect(servicio.token).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});
