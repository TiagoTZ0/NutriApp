// Definición de Paciente (Lo que viene de /clinical/patients/)
export interface IPatient {
  id: string;          // UUID
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  
  // Linked user fields
  app_user_id: string | null; 
  status_label?: string;
  photo?: string;
}
