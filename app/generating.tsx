import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

import AuraLogo from '@/components/AuraLogo';

const MOCK_PHRASE = 'abandon ability able about above absent absorb abstract absurd abuse access accident';

export default function GeneratingScreen() {
  const { mode } = useLocalSearchParams<{ mode: 'create' | 'import' }>();
  const isImport = mode === 'import';

  const logoScale = useSharedValue(1);
  const logoOpacity = useSharedValue(0.5);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    // Pulsing logo — scale breathe
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.96, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    // Pulsing logo — glow up / glow down (opacity breathe)
    logoOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.35, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Status text fade in
    textOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );

    // Navigate after delay
    const timer = setTimeout(() => {
      if (isImport) {
        router.replace({ pathname: '/wallet-ready', params: { from: 'import' } });
      } else {
        router.replace({ pathname: '/seed-phrase', params: { phrase: MOCK_PHRASE } });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.center}>
        <Animated.View style={logoStyle}>
          <AuraLogo size={96} isDark />
        </Animated.View>

        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={styles.statusText}>
            {isImport ? 'RESTORING' : 'SECURING YOUR KEYS'}
          </Text>
        </Animated.View>
      </View>
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
  },
  textContainer: {
    marginTop: 40,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 4,
    textAlign: 'center',
  },
});
