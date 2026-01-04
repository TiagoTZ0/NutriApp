import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedPressableButton } from '../../../shared/components/animations/AnimatedPressableButton';

interface RoleSelectionCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  isPatient: boolean;
  onPress: () => void;
}

export const RoleSelectionCard = ({
  emoji,
  title,
  subtitle,
  isPatient,
  onPress
}: RoleSelectionCardProps) => {
  return (
    <AnimatedPressableButton
      style={[styles.card, isPatient ? styles.cardPatient : styles.cardPro]}
      onPress={onPress}
      activeScale={0.98}
    >
      <View style={[styles.iconCircle, !isPatient && { backgroundColor: '#E3F2FD' }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSub}>{subtitle}</Text>
      </View>
    </AnimatedPressableButton>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1.5,
  },
  cardPatient: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50'
  },
  cardPro: {
    backgroundColor: '#E8F5E9',
    borderColor: '#27b05cff'
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  emoji: { fontSize: 28 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#263238' },
  cardSub: { fontSize: 14, color: '#90A4AE', marginTop: 4 },
});
