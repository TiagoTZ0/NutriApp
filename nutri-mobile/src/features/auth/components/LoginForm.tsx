import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuthStore } from '../store/auth-store';
import { AnimatedPressableButton } from '../../../shared/components/animations/AnimatedPressableButton';

interface LoginFormProps {
  isProfessional: boolean;
  onLoginSuccess?: () => void;
}

export const LoginForm = ({ isProfessional, onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, logout } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Faltan datos", "Por favor ingresa correo y contraseña");
      return;
    }

    const success = await login(email, password);

    if (success) {
      const currentUser = useAuthStore.getState().user;

      // Validación de Rol Cruzado
      if (currentUser?.role !== (isProfessional ? 'PROFESSIONAL' : 'PATIENT') && currentUser?.role !== 'ORG_OWNER') {
        Alert.alert(
          "Acceso Incorrecto",
          `Esta cuenta pertenece a un ${currentUser?.role === 'PROFESSIONAL' ? 'Nutricionista' : 'Paciente'}.`
        );
        logout();
      } else {
        console.log("Login correcto y rol validado");
        onLoginSuccess?.();
      }
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="ejemplo@correo.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#CFD8DC"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#CFD8DC"
      />

      <AnimatedPressableButton
        style={[styles.button, isProfessional ? styles.btnPro : styles.btnPatient]}
        onPress={handleLogin}
        disabled={isLoading}
        activeScale={0.97}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </AnimatedPressableButton>
    </View>
  );
};

const styles = StyleSheet.create({
  form: { marginTop: 30 },
  label: { fontSize: 14, fontWeight: '600', color: '#263238', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ECEFF1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#FAFBFC',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },
  btnPatient: { backgroundColor: '#009688' },
  btnPro: { backgroundColor: '#009688' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
