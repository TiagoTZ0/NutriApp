import React, { useRef } from 'react';
import { Animated, Pressable, Text, TextStyle, StyleProp } from 'react-native';

interface Props {
  onPress?: () => void;
  // Usamos TextStyle porque se aplica al texto interno
  style?: StyleProp<TextStyle>; 
  children: React.ReactNode;
}

export const AnimatedPressableText: React.FC<Props> = ({ onPress, style, children }) => {
  const opacity = useRef(new Animated.Value(1)).current;

  // 1. Animación al presionar (Baja opacidad)
  const handlePressIn = () => {
    Animated.timing(opacity, {
      toValue: 0.4,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  // 2. Animación al soltar (Restaura opacidad)
  const handlePressOut = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}   // <--- Se activa aquí
      onPressOut={handlePressOut} // <--- Se restaura aquí
    >
      <Animated.Text style={[style, { opacity }]}>
        {children}
      </Animated.Text>
    </Pressable>
  );
};