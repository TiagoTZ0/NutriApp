import { create } from 'zustand';
import { api } from '../../../core/api/api-client';
import { DietPlan } from '../types';

interface NutritionState {
  currentPlan: DietPlan | null;
  isLoading: boolean;
  error: string | null;

  // Acciones
  fetchCurrentPlan: () => Promise<void>;
  resetNutrition: () => void;
}

export const useNutritionStore = create<NutritionState>((set) => ({
  currentPlan: null,
  isLoading: false,
  error: null,

  fetchCurrentPlan: async () => {
    set({ isLoading: true, error: null });
    try {
      // Petición al endpoint que creamos en el Backend
      // Ajusta la URL si tu endpoint en Django es diferente
      const response = await api.get('/nutrition/diet-plans/current/');
      
      set({ currentPlan: response.data, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching diet plan:', error);
      set({ 
        error: error.response?.data?.detail || 'No se pudo cargar tu plan.',
        isLoading: false 
      });
    }
  },

  resetNutrition: () => set({ currentPlan: null, error: null }),
}));