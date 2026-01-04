import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StatusBar, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BackButton } from '../../../shared/components/buttons/BackButton';
import { LoginForm } from '../components/LoginForm';

export const LoginScreen = () => {
  const route = useRoute<any>();

  const targetRole = route.params?.targetRole || 'PATIENT';
  const isProfessional = targetRole === 'PROFESSIONAL';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#b6e1bbff" />

      <View style={styles.topBar}>
        <BackButton />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Text style={styles.title}>
          {isProfessional ? 'Acceso Profesionales' : 'Acceso Pacientes'}
        </Text>
        <Text style={styles.subtitle}>
          Ingresa tus credenciales de {isProfessional ? 'NutriApp Pro' : 'NutriApp'}
        </Text>

        <LoginForm isProfessional={isProfessional} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#b6e1bbff' },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 15
  },
  content: { flex: 1, padding: 24, justifyContent: 'center', marginTop: -20 },
  title: { textAlign: 'center', fontSize: 28, fontWeight: 'bold', color: '#263238', marginBottom: 8 },
  subtitle: { textAlign: 'center', fontSize: 16, color: '#90A4AE', marginBottom: 30 },
});