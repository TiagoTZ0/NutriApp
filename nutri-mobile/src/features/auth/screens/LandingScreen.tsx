import React, { use, useState } from 'react';
import { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedPressableText } from '../../../shared/components/animations/AnimatedPressableText';
import { AnimatedPressableScale } from '../../../shared/components/animations/AnimatedPressableScale';
import { SelectTermsPolScreen } from '../components/SelectTermsPolScreen';
import { AnimatedPressableButton } from '../../../shared/components/animations/AnimatedPressableButton';

export const LandingScreen = () => {
  const navigation = useNavigation<any>();

  const handleNavigation = (intent: 'LOGIN' | 'REGISTER') => {
    navigation.navigate('Welcome', { intent });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#b6e1bbff" />

      <View style={styles.content}>
        {/* 🍏 LOGO GRANDE */}
        <View style={styles.logoContainer}>
          <AnimatedPressableScale>
            <Text style={styles.emoji}>🍏</Text>
          </AnimatedPressableScale>
          <Text style={styles.brand}>NutriApp</Text>
          <Text style={styles.slogan}>Tu salud, conectada.</Text>
        </View>

        {/* 🔘 BOTONES DE ACCIÓN */}
        {/* BOTÓN ENLAZAR CON MI NUTRICIONISTA */}
        <View style={styles.buttonsContainer}>
            <AnimatedPressableButton
            style={styles.btnenlazar}
            onPress={() => console.log('ENLAZAR CON MI NUTRICIONISTA')}
          >
            <Text style={styles.textenlazar}>ENLAZAR CON MI NUTRICIONISTA</Text>
          </AnimatedPressableButton>

          {/* BOTÓN INICIAR SESIÓN */}
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => handleNavigation('LOGIN')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnPrimaryText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          {/* BOTÓN CREAR CUENTA */}
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => handleNavigation('REGISTER')}
            activeOpacity={0.6}
          >
            <Text style={styles.btnSecondaryText}>Crear Cuenta</Text>
          </TouchableOpacity>
        </View>

        {/* 📜 FOOTER LEGAL */}
        <View style={styles.footer}>
          <AnimatedPressableText
            style={styles.termsText}
            onPress={() => { console.log('Términos y Política'); setIsModalOpen(true); }}
          >
            Al continuar, aceptas nuestros{' '}
            <Text style={styles.link}>
              Términos de Servicio
            </Text>{' '}
            y{' '}
            <Text style={styles.link}>
              Política de Privacidad
            </Text>.
          </AnimatedPressableText>
        </View>
      </View>
      <SelectTermsPolScreen
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#b6e1bbff' },
  content: { flex: 1, padding: 30, justifyContent: 'space-between' },

  // Logo
  logoContainer: { flex: 2, justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 80, marginBottom: 10 },
  brand: { fontSize: 32, fontWeight: '900', color: '#263238', letterSpacing: -1 },
  slogan: { fontSize: 18, color: '#90A4AE', fontWeight: 'bold', marginTop: 5 },

  // Botones
  buttonsContainer: { flex: 1, justifyContent: 'flex-end', paddingBottom: 20 },
  btnPrimary: {
    backgroundColor: '#009688', paddingVertical: 18, borderRadius: 16,
    alignItems: 'center', marginBottom: 16,
    shadowColor: '#009688', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
  },
  btnPrimaryText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  btnSecondary: {
    backgroundColor: '#F5F7FA', paddingVertical: 18, borderRadius: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#ECEFF1'
  },
  btnSecondaryText: { color: '#546E7A', fontSize: 18, fontWeight: '700' },

  // Footer
  footer: { paddingBottom: 10 },
  termsText: { textAlign: 'center', color: '#757e83ff', fontSize: 12, lineHeight: 18 },
  link: { color: '#333635ff', fontWeight: '700' },
  btnenlazar: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  textenlazar: {
    color: '#009688',
    fontSize: 16,
    fontWeight: '700'
  },
});