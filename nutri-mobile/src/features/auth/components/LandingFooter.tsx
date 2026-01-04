import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const LandingFooter = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.termsText}>
        Al continuar, aceptas nuestros{' '}
        <Text style={styles.link} onPress={() => console.log('Abrir TyC')}>
          Términos de Servicio
        </Text>{' '}
        y{' '}
        <Text style={styles.link} onPress={() => console.log('Abrir Privacidad')}>
          Política de Privacidad
        </Text>.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: { paddingBottom: 10 },
  termsText: { 
    textAlign: 'center', 
    color: '#757e83ff', 
    fontSize: 12, 
    lineHeight: 18 
  },
  link: { 
    color: '#333635ff', 
    fontWeight: '700' 
  }
});
