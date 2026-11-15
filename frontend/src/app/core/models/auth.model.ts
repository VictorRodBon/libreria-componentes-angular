/** Datos públicos del usuario con sesión (nunca incluye la contraseña). */
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

/** Respuesta de POST /api/auth/login: incluye el token JWT. */
export interface LoginRespuesta {
  success: boolean;
  message: string;
  token: string;
  data: Usuario;
}

/** Respuesta de POST /api/auth/register: crea la cuenta pero no devuelve token. */
export interface RegistroRespuesta {
  success: boolean;
  message: string;
  data: Usuario;
}