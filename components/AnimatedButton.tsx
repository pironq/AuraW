import React from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  isDark?: boolean;
  style?: ViewStyle;
}

export default function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  isDark = false,
  style,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const isPrimary = variant === 'primary';

  const buttonColors = {
    primary: {
      bg: isDark ? '#fff' : '#000',
      text: isDark ? '#000' : '#fff',
    },
    secondary: {
      bg: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
      text: isDark ? '#fff' : '#000',
      border: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
    },
  };

  const colors = buttonColors[variant];

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.button,
        {
          backgroundColor: colors.bg,
          borderWidth: isPrimary ? 0 : 1,
          borderColor: isPrimary ? 'transparent' : (colors as any).border,
        },
        animatedStyle,
        style,
      ]}
    >
      <Animated.Text
        style={[
          styles.buttonText,
          { color: colors.text },
        ]}
      >
        {title}
      </Animated.Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
