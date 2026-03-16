import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import AuraLogo from '@/components/AuraLogo';

export default function WalletReadyScreen() {
  const { from } = useLocalSearchParams<{ from: string }>();
  const initialY = from === 'import' ? 30 : from === 'create' ? -60 : 0;

  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(initialY);
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(30);

  useEffect(() => {
    // Logo slide + pop in
    logoOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    logoTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });

    // Checkmark — single clean scale-up
    checkOpacity.value = withDelay(500, withTiming(1, { duration: 300 }));
    checkScale.value = withDelay(500,
      withSpring(1, { damping: 14, stiffness: 100 })
    );

    // Text slide up
    textOpacity.value = withDelay(
      800,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    textTranslateY.value = withDelay(
      800,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );

    // Button
    buttonOpacity.value = withDelay(
      1200,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    buttonTranslateY.value = withDelay(
      1200,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }, { translateY: logoTranslateY.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.center}>
        {/* Logo */}
        <Animated.View style={logoStyle}>
          <AuraLogo size={72} isDark />
        </Animated.View>

        {/* Success checkmark */}
        <Animated.View style={[styles.checkCircle, checkStyle]}>
          <Ionicons name="checkmark" size={28} color="#fff" />
        </Animated.View>

        {/* Text */}
        <Animated.View style={[styles.textBlock, textStyle]}>
          <Text style={styles.title}>You're all set</Text>
          <Text style={styles.subtitle}>
            Your wallet is ready to use.{'\n'}Welcome to AuraW.
          </Text>
        </Animated.View>
      </View>

      {/* CTA */}
      <Animated.View style={[styles.bottomSection, buttonStyle]}>
        <Pressable
          onPress={() => router.replace('/')}
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.ctaText}>Let's Go</Text>
          <Ionicons name="arrow-forward" size={17} color="#000" style={{ marginLeft: 8 }} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  checkCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  textBlock: {
    alignItems: 'center',
    marginTop: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 22,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 44,
    paddingTop: 12,
  },
  ctaButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.2,
  },
});
