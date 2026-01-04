import { Platform } from 'react-native';

// 🔧 CONFIGURACIÓN DE API PARA DIFERENTES DISPOSITIVOS
// 
// INSTRUCCIONES:
// 1. Para EMULADOR Android: Usa 10.0.2.2
// 2. Para DISPOSITIVO FÍSICO: Usa tu IP local (ejemplo: 192.168.1.50)
//    - En Windows: abre CMD y escribe "ipconfig", busca "IPv4"
//    - En Mac/Linux: abre Terminal y escribe "ifconfig", busca "inet"
// 3. Asegúrate de que tu celular y laptop estén en la MISMA RED WiFi

// 🎯 CAMBIA ESTA IP A LA DE TU COMPUTADORA
const LOCAL_IP = '192.168.18.64'; // ← CAMBIA ESTO A TU IP LOCAL

// Configuración automática
const getApiUrl = () => {
  // En desarrollo, siempre usa la IP local (funciona para emulador Y físico)
  if (__DEV__) {
    return `http://${LOCAL_IP}:8000/api`;
  }

  // En producción, usa configuración específica por plataforma
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:8000/api`; // Emulador Android
  } else {
    return 'http://localhost:8000/api'; // iOS Simulator
  }
};

export const API_URL = getApiUrl();

// Debug: Mostrar qué URL se está usando
if (__DEV__) {
  console.log('🌐 API_URL configurada:', API_URL);
}