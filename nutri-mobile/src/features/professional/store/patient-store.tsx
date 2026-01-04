import { create } from 'zustand';
// 👇 Asegúrate que esta ruta apunte a tu archivo api.ts que creamos antes
import { nhApi } from '../../../core/config/api';
// 👇 Importamos el tipo desde el archivo central (Buenas Prácticas)
import { Patient } from '../../auth/types';

interface PatientState {
  patients: Patient[];
  isLoading: boolean;
  error: string | null;

  // Acciones
  fetchPatients: () => Promise<void>;
  addPatient: (patientData: any) => Promise<boolean>;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  isLoading: false,
  error: null,

  fetchPatients: async () => {
    set({ isLoading: true, error: null });

    try {
      console.log("Fetching patients from /clinical/patients/");

      // Fetch patients from API with authentication
      const { data } = await nhApi.get<Patient[]>('/clinical/patients/');

      console.log(`Fetched ${data.length} patients`);
      set({ patients: data, isLoading: false });

    } catch (e: any) {
      // Error handling
      const errorMsg = e.response?.data?.detail || 'Connection error';
      const status = e.response?.status;

      console.error(`Store error (${status}):`, errorMsg);

      if (status === 401) {
        console.log("⚠️ El Token es inválido o expiró. Redirigir a Login.");
      }

      set({
        isLoading: false,
        patients: [],
        error: errorMsg
      });
    }
  },

  addPatient: async (patientData: any) => {
    set({ isLoading: true, error: null });
    try {
      console.log("➕ STORE: Creando paciente en /clinical/patients/...");
      await nhApi.post('/clinical/patients/', patientData);

      console.log("Patient created successfully");
      // Refrescamos la lista para ver al nuevo paciente
      const { fetchPatients } = get();
      await fetchPatients();

      set({ isLoading: false });
      return true;

    } catch (e: any) {
      const errorMsg = e.response?.data?.detail || 'Error al registrar paciente';
      console.error(`🔴 STORE ERROR:`, errorMsg);
      set({ isLoading: false, error: errorMsg });
      return false;
    }
  }
}));