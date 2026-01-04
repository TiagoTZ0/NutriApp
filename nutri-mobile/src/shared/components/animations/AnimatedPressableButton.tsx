import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

interface AnimatedPressableButtonProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  activeScale?: number;
  pressedOpacity?: number;
  disabled?: boolean;
}

export const AnimatedPressableButton = ({
  children,
  style,
  activeScale = 0.98,
  pressedOpacity = 0.92,
  disabled = false,
  onPressIn,
  onPressOut,
  ...rest
}: AnimatedPressableButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePressIn: PressableProps['onPressIn'] = (e) => {
    Animated.parallel([
      Animated.spring(scale, { toValue: activeScale, useNativeDriver: true, friction: 18 }),
      Animated.timing(opacity, { toValue: pressedOpacity, duration: 100, useNativeDriver: true }),
    ]).start();
    onPressIn?.(e);
  };

  const handlePressOut: PressableProps['onPressOut'] = (e) => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 8 }),
      Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    onPressOut?.(e);
  };

  return (
    <Pressable
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityState={{ disabled: !!disabled }}
    >
      <Animated.View style={[{ transform: [{ scale }], opacity }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};
