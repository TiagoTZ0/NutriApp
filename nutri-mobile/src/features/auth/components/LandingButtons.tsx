import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedPressableButton } from '../../../shared/components/animations/AnimatedPressableButton';

export const LandingButtons = () => {
  const navigation = useNavigation<any>();

  const handleNavigation = (intent: 'LOGIN' | 'REGISTER') => {
    navigation.navigate('Welcome', { intent });
  };

  return (
    <View style={styles.buttonsContainer}>
      <AnimatedPressableButton 
        style={styles.btnPrimary} 
        onPress={() => handleNavigation('LOGIN')}
        activeScale={0.97}
      >
        <Text style={styles.btnPrimaryText}>Iniciar Sesión</Text>
      </AnimatedPressableButton>

      <AnimatedPressableButton 
        style={styles.btnSecondary} 
        onPress={() => handleNavigation('REGISTER')}
        activeScale={0.97}
      >
        <Text style={styles.btnSecondaryText}>Crear Cuenta Nueva</Text>
      </AnimatedPressableButton>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: { flex: 1, justifyContent: 'flex-end', paddingBottom: 20 },
  btnPrimary: {
    backgroundColor: '#009688', 
    paddingVertical: 18, 
    borderRadius: 16,
    alignItems: 'center', 
    marginBottom: 16,
    shadowColor: '#009688', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 4
  },
  btnPrimaryText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  btnSecondary: {
    backgroundColor: '#F5F7FA', 
    paddingVertical: 18, 
    borderRadius: 16,
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#ECEFF1'
  },
  btnSecondaryText: { color: '#546E7A', fontSize: 18, fontWeight: '700' },
});
