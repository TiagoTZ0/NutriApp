import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nhApi } from '../../../core/config/api';

// 👇 AQUÍ USAMOS TUS IMPORTACIONES EXISTENTES
import { User, AuthResponse } from '../types';

// Helper JWT (Mantenemos esto igual)
const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    try { return JSON.parse(atob(token.split('.')[1])); } catch (err) { return null; }
  }
};

// Definimos la interfaz del Store aquí mismo (es capa de Presentación, no Dominio)
interface AuthState {
  token: string | null;
  user: User | null; // Usamos tu User del dominio
  status: 'checking' | 'authenticated' | 'unauthenticated';
  isLoading: boolean;
  error: string | null;
  onboardingStep: number;
  registrationForm: any;
  onboardingForm: any;

  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  updateProfile: (data: any) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;

  setRegistrationForm: (role: string, data: any) => void;
  setOnboardingForm: (role: string, data: any) => void;
  resetRegistrationForm: (role: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ... (Estado inicial)
      token: null,
      user: null,
      status: 'unauthenticated',
      isLoading: false,
      error: null,
      onboardingStep: 0,

      registrationForm: {
        PATIENT: { first_name: '', last_name: '', email: '', password: '', confirm_password: '', newsletter: true },
        PROFESSIONAL: { first_name: '', last_name: '', email: '', password: '', confirm_password: '', newsletter: true },
      },
      onboardingForm: {
        PATIENT: { phone: '', age: '', gender: '', height: '' },
        PROFESSIONAL: { phone: '', age: '', gender: '', height: '' },
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          console.log("Attempting login at /login/");
          // Send login request with email and password
          const { data } = await nhApi.post<AuthResponse>('/login/', { email, password });

          // Read access token from response
          const accessToken = data.access;

          if (!accessToken) throw new Error("No se recibió token");

          nhApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

          let userData = null;
          const decoded = decodeJwt(accessToken);
          const userId = decoded?.user_id || decoded?.sub;

          if (userId) {
            try {
              // Usamos el Genérico <User> con tu tipo
              const userRes = await nhApi.get<User>(`/users/${userId}/`);
              userData = userRes.data;
            } catch (err) {
              console.warn("⚠️ Falló carga de perfil.");
            }
          }

          set({
            status: 'authenticated',
            token: accessToken,
            user: userData,
            isLoading: false,
            error: null
          });
          return true;
        } catch (error: any) {
          console.error("Login Error:", error);
          set({ status: 'unauthenticated', token: null, isLoading: false, error: 'Credenciales incorrectas' });
          return false;
        }
      },

      register: async (registerData: any) => {
        set({ isLoading: true, error: null });
        try {
          const payload = {
            email: registerData.email,
            first_name: registerData.first_name,
            last_name: registerData.last_name,
            role: registerData.role,
            organization: registerData.organization || null,
            password: registerData.password
          };

          await nhApi.post('/users/', payload);

          // Login Automático
          const loginSuccess = await get().login(payload.email, payload.password);
          if (loginSuccess) {
            set({ onboardingStep: 1 });
            return true;
          }
          return true;
        } catch (e: any) {
          let msg = e.response?.data?.detail || 'Error al crear cuenta';
          if (e.response?.status === 401) msg = "Error 401 en Registro.";
          set({ isLoading: false, error: msg });
          return false;
        }
      },

      updateProfile: async (data: any) => {
        const { user } = get();
        if (!user?.id) return false;
        set({ isLoading: true });
        try {
          const res = await nhApi.put<User>(`/users/${user.id}/`, data);
          set({ user: res.data, isLoading: false });
          return true;
        } catch (e: any) {
          set({ isLoading: false, error: "Error actualizando" });
          return false;
        }
      },

      logout: () => {
        delete nhApi.defaults.headers.common['Authorization'];
        set({ status: 'unauthenticated', token: null, user: null, onboardingStep: 0 });
      },

      checkAuth: async () => {
        const { token, user } = get();
        if (!token) { set({ status: 'unauthenticated' }); return; }
        try {
          const userId = user?.id || decodeJwt(token)?.user_id;
          if (userId) {
            const res = await nhApi.get<User>(`/users/${userId}/`);
            set({ user: res.data, status: 'authenticated' });
          } else {
            throw new Error("Token inválido");
          }
        } catch (error) {
          get().logout();
        }
      },

      setRegistrationForm: (role: string, data: any) => set((state: any) => ({
        registrationForm: { ...state.registrationForm, [role]: { ...state.registrationForm[role], ...data } }
      })),
      setOnboardingForm: (role: string, data: any) => set((state: any) => ({
        onboardingForm: { ...state.onboardingForm, [role]: { ...state.onboardingForm[role], ...data } }
      })),
      resetRegistrationForm: (role: string) => { /* ... */ }
    }),
    {
      name: ' nh-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        status: state.status,
        onboardingStep: state.onboardingStep,
        registrationForm: state.registrationForm,
        onboardingForm: state.onboardingForm
      }),
    }
  )
);