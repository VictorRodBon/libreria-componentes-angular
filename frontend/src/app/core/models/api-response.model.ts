/** Envoltorio común de las respuestas de la API: `{ success, data }`. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}