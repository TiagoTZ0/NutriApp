export interface IAuthResponse {
  refresh: string;
  access: string;
  token?: string; // <--- Agrégalo como opcional
  user?: any;     // <--- Agrégalo si quieres recibir el usuario
}