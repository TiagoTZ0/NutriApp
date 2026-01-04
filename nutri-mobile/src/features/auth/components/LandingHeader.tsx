import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const LandingHeader = () => {
  return (
    <View style={styles.logoContainer}>
      <Text style={styles.emoji}>🍏</Text>
      <Text style={styles.brand}>NutriApp</Text>
      <Text style={styles.slogan}>Tu salud, conectada.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: { 
    flex: 2, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emoji: { 
    fontSize: 80, 
    marginBottom: 10 
  },
  brand: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#263238', 
    letterSpacing: -1 
  },
  slogan: { 
    fontSize: 18, 
    color: '#90A4AE', 
    marginTop: 5 
  },
});
