export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export interface LoginRespuesta {
  success: boolean;
  message: string;
  token: string;
  data: Usuario;
}

export interface RegistroRespuesta {
  success: boolean;
  message: string;
  data: Usuario;
}