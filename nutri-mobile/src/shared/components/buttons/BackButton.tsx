import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressableButton } from '../animations/AnimatedPressableButton';

export const BackButton = () => {
  const navigation = useNavigation<any>();

  return (
    <AnimatedPressableButton
      onPress={() => navigation.goBack()}
      style={styles.backButton}
      activeScale={0.92}
    >
      <Ionicons name="chevron-back" size={24} color="#263238" />
      <Text style={styles.backText}>Volver</Text>
    </AnimatedPressableButton>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238',
    marginLeft: 2,
  },
});
