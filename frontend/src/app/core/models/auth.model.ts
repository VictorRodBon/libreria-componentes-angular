export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  data: Usuario;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: Usuario;
}