import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StatusBar, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BackButton } from '../../../shared/components/buttons/BackButton';
import { RoleSelectionCard } from '../components/RoleSelectionCard';

export const WelcomeScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const intent = route.params?.intent || 'LOGIN';
  const isRegister = intent === 'REGISTER';

  const handleRoleSelection = (role: 'PATIENT' | 'PROFESSIONAL') => {
    if (isRegister) {
      navigation.navigate('Register', { targetRole: role });
    } else {
      navigation.navigate('Login', { targetRole: role });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#b6e1bbff" />

      <View style={styles.topBar}>
        <BackButton />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isRegister ? 'Crear Cuenta' : 'Bienvenido'}
          </Text>
          <Text style={styles.question}>
            Para continuar, selecciona tu perfil:
          </Text>
        </View>

        <RoleSelectionCard
          emoji="🍏"
          title="Soy Paciente"
          subtitle={isRegister ? 'Quiero ver mi dieta' : 'Ingresar a mi perfil'}
          isPatient={true}
          onPress={() => handleRoleSelection('PATIENT')}
        />

        <RoleSelectionCard
          emoji="👨‍⚕️"
          title="Soy Nutricionista"
          subtitle={isRegister ? 'Quiero usar el software' : 'Gestionar mi consultorio'}
          isPatient={false}
          onPress={() => handleRoleSelection('PROFESSIONAL')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#b6e1bbff' },
  topBar: {
    paddingHorizontal: 10,
    paddingTop: 15,
    zIndex: 10
  },
  content: { flex: 1, padding: 24, justifyContent: 'center', marginTop: -40 },
  header: { marginBottom: 30, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '900', color: '#263238', marginBottom: 8 },
  question: { fontSize: 16, color: '#78909C', textAlign: 'center' },
});