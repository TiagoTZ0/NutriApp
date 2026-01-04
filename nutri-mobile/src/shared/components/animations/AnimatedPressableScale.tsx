import React, { useRef } from 'react';
import { 
  Animated, 
  Pressable, 
  ViewStyle, 
  TextStyle, 
  ImageStyle, 
  StyleProp 
} from 'react-native';

interface Props {
  onPress?: () => void;
  style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  children: React.ReactNode;
  activeScale?: number; // Prop opcional para controlar cuánto crece
}

export const AnimatedPressableScale: React.FC<Props> = ({ 
  onPress, 
  style, 
  children, 
  activeScale = 1.15 // Valor por defecto: crece un 20%
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    // Secuencia de "latido"
    Animated.sequence([
      Animated.timing(scale, {
        toValue: activeScale,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn}>
      <Animated.View 
        style={[
          style, 
          { transform: [{ scale }] } // SOLO maneja escala
        ] as any}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};