import axios from 'axios';
import { API_URL } from './constants';
// Importamos el store directamente para leer el token sin dependencias circulares complejas
import { useAuthStore } from '../../features/auth/store/auth-store';

export const nhApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Mantenemos tu timeout de 10s
});

// 1. INTERCEPTOR REQUEST (La solución al error 401)
nhApi.interceptors.request.use(
    async (config) => {
        // Leemos el token directo de la memoria de Zustand
        const token = useAuthStore.getState().token;

        // 🕵️‍♂️ DETECTIVE DE ENDPOINTS
        // Verificamos si es un endpoint público donde NO queremos mandar token
        // (Aunque tengamos uno viejo guardado).

        // 1. Login (/api/login/)
        const isLogin = config.url?.includes('/api/login');

        // 2. Registro (/api/users/ con método POST)
        const isRegister = config.url?.includes('/api/users') && config.method?.toLowerCase() === 'post';

        // Solo inyectamos el token si existe Y NO es login ni registro
        if (token && !isLogin && !isRegister) {
            config.headers.Authorization = `Bearer ${token}`;

            if (__DEV__) {
                console.log(`🔐 Token inyectado en: ${config.url}`);
            }
        } else {
            if (__DEV__) {
                console.log(`⚪ Petición pública (Sin Token): ${config.url}`);
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 2. INTERCEPTOR RESPONSE (Manejo de sesión caducada)
nhApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response ? error.response.status : null;
        const url = error.config?.url || '';

        // Si es 401 y NO estábamos intentando loguearnos ni registrarnos...
        if (status === 401 && !url.includes('/api/login') && !url.includes('/api/users')) {
            console.warn('⛔ Sesión expirada (401). Cerrando sesión...');

            // Usamos la acción del store para limpiar todo correctamente
            useAuthStore.getState().logout();
        }

        return Promise.reject(error);
    }
);