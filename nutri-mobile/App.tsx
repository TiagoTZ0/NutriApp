import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StatusBar, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Screens
import { WelcomeScreen } from './src/features/auth/screens/WelcomeScreen';
import { LandingScreen } from './src/features/auth/screens/LandingScreen';
import { LoginScreen } from './src/features/auth/screens/LoginScreen';
import { ProfessionalNavigator } from './src/navigation/ProfessionalNavigator';
import { AddPatientScreen } from './src/features/professional/screens/AddPatientScreen';
import { RegisterScreen } from './src/features/auth/screens/RegisterScreen';
import { OnboardingScreen } from './src/features/auth/screens/OnboardingScreen';
import { SelectTermsPolScreen } from './src/features/auth/components/SelectTermsPolScreen'; // ¡No olvides importar tu modal!

// Store
import { useAuthStore } from './src/features/auth/store/auth-store';

// Placeholder temporal
const PatientPlaceholderScreen = () => {
  const logout = useAuthStore(state => state.logout);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA', padding: 20 }}>
      <Text style={{ fontSize: 40, marginBottom: 20 }}>🍎</Text>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#263238', textAlign: 'center' }}>
        Vista del Paciente en Construcción
      </Text>
      <Text style={{ marginTop: 10, color: '#78909C', textAlign: 'center', marginBottom: 30 }}>
        Esta sección está siendo diseñada con el mismo cariño que la del Nutricionista.
      </Text>

      <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: '#009688',
          paddingHorizontal: 30,
          paddingVertical: 12,
          borderRadius: 12,
          elevation: 2
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>Cerrar Sesión / Cambiar de Rol</Text>
      </TouchableOpacity>
    </View>
  );
};

// Wrapper component for SelectTermsPolScreen modal
const SelectTermsPolScreenWrapper = ({ navigation }: any) => (
  <SelectTermsPolScreen
    isVisible={true}
    onClose={() => navigation.goBack()}
  />
);

const Stack = createNativeStackNavigator();

// Tema personalizado para evitar flashes blancos
const NutriTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#009688',
    background: '#b6e1bbff', // Color de fondo global
    card: '#ffffff',
    text: '#000000',
    border: 'transparent',
    notification: '#ff4081',
  },
};

export default function App() {
  // 1. CORRECCIÓN: Extraemos 'status' en lugar de los booleanos antiguos
  const { status, user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  // 2. CORRECCIÓN: Usamos el estado 'checking' para la pantalla de carga
  if (status === 'checking') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#b6e1bbff' }}>
        <ActivityIndicator size="large" color="#009688" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
      <View style={styles.appContainer}>
        <NavigationContainer theme={NutriTheme}>
          <StatusBar barStyle="dark-content" backgroundColor="#b6e1bbff" />

          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#b6e1bbff' },
              animation: 'slide_from_right',
              animationTypeForReplace: 'pop', // Usa animación inversa al retroceder
              presentation: 'card',
              // Configuración para animación suave en ambas direcciones
              gestureEnabled: true,
              fullScreenGestureEnabled: true,
            }}
          >

            {/* 3. CORRECCIÓN: Lógica basada en si NO estamos autenticados */}
            {status !== 'authenticated' ? (
              // === FLUJO PÚBLICO (No Logueado) ===
              <>
                <Stack.Screen name="Landing" component={LandingScreen} />
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              </>
            ) : (
              // === FLUJO PRIVADO (Logueado) ===
              // Aquí decidimos a dónde va según su ROL
              user?.role === 'PROFESSIONAL' || user?.role === 'ORG_OWNER' ? (
                // El AddPatient está al mismo nivel que ProfessionalRoot
                // Esto garantiza que al navegar a él, el TabBar desaparezca.
                <Stack.Group>
                  <Stack.Screen name="ProfessionalRoot" component={ProfessionalNavigator} />
                  <Stack.Screen name="AddPatient" component={AddPatientScreen} />
                </Stack.Group>
              ) : (
                <Stack.Screen name="PatientRoot" component={PatientPlaceholderScreen} />
              )
            )}

            {/* 4. IMPORTANTE: Agregamos el grupo Modal aquí al final.
                Esto permite abrir los términos tanto desde el Landing (público) 
                como desde el perfil (privado) si quisieras en el futuro.
            */}
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen
                name="SelectTermsPolScreen"
                component={SelectTermsPolScreenWrapper}
              />
            </Stack.Group>

          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  appContainer: { flex: 1, backgroundColor: '#b6e1bbff' }
});