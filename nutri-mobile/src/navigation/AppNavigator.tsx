import React, { useEffect } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../features/auth/store/auth-store';

// Importa tus pantallas
import { LandingScreen } from '../features/auth/screens/LandingScreen';
import { WelcomeScreen } from '../features/auth/screens/WelcomeScreen';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { ProfessionalHomeScreen } from '../features/professional/screens/ProfessionalHomeScreen';


const Stack = createNativeStackNavigator();

// 1. TEMA PERSONALIZADO (Solución al borde blanco)
const NutriTheme = {
  ...DefaultTheme, // Hereda fuentes y configuraciones por defecto
  colors: {
    ...DefaultTheme.colors,
    primary: '#009688',
    background: '#b6e1bbff', // <--- Pinta el fondo global de la app
    card: '#ffffff',
    text: '#000000',
    border: 'transparent',
    notification: '#ff4081',
  },
};

export const AppNavigator = () => {
  const status = useAuthStore(state => state.status);
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth(); 
  }, [checkAuth]);

  return (
    // 2. APLICAR TEMA AL CONTENEDOR
    <NavigationContainer theme={NutriTheme}>
      
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          // 3. FONDO DEL STACK (Solución definitiva al flashazo blanco)
          contentStyle: { backgroundColor: '#b6e1bbff' }, 
          animation: 'slide_from_right' 
        }}
      >

        {status === 'authenticated' ? (
          // === RUTAS PRIVADAS ===
          <Stack.Screen name="ProfessionalHome" component={ProfessionalHomeScreen} />
        ) : (
          // === RUTAS PÚBLICAS ===
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
};