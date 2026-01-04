// Definición de Usuario (Lo que viene del Backend en /users/me/ o login)
export interface IUser {
  id: string; // UUID
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  organization?: string;
}
