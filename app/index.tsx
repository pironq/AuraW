import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming
} from 'react-native-reanimated';

import AnimatedButton from '@/components/AnimatedButton';
import AuraLogo from '@/components/AuraLogo';
import VideoBackground from '@/components/VideoBackground';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeScreen() {
  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const textTranslateY = useSharedValue(40);
  const textOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(60);
  const buttonsOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo entrance
    logoOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
    logoScale.value = withDelay(
      400,
      withSpring(1, { damping: 12, stiffness: 100 })
    );

    // Headline entrance
    textOpacity.value = withDelay(
      900,
      withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) })
    );
    textTranslateY.value = withDelay(
      900,
      withSpring(0, { damping: 14, stiffness: 80 })
    );

    // Buttons entrance
    buttonsOpacity.value = withDelay(
      1300,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    buttonsTranslateY.value = withDelay(
      1300,
      withSpring(0, { damping: 14, stiffness: 80 })
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  const handleCreateWallet = () => {
    router.push('/create-wallet');
  };

  const handleImportWallet = () => {
    router.push('/import-wallet');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Video background — dimmed with subtle blur */}
      <VideoBackground />

      {/* Diagonal dark gradient behind text area — bottom portion */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.75)', 'rgba(0,0,0,0.92)']}
        locations={[0, 0.25, 0.6, 1]}
        style={[StyleSheet.absoluteFill, { zIndex: 5 }]}
      />

      {/* Content overlay */}
      <View style={styles.content}>
        {/* Logo - centered in upper portion */}
        <View style={styles.logoContainer}>
          <Animated.View style={logoAnimatedStyle}>
            <AuraLogo
              size={80}
              isDark
            />
          </Animated.View>
        </View>

        {/* Bottom section: headline + buttons */}
        <View style={styles.bottomSection}>
          <Animated.View style={textAnimatedStyle}>
            <Animated.Text
              style={[
                styles.headline,
                { color: '#fff' },
              ]}
            >
              Your world.{'\n'}One wallet.
            </Animated.Text>
          </Animated.View>

          <Animated.View style={[styles.buttonRow, buttonsAnimatedStyle]}>
            <AnimatedButton
              title="Create Wallet"
              onPress={handleCreateWallet}
              variant="primary"
              isDark
              style={{ marginRight: 12 }}
            />
            <AnimatedButton
              title="Import Wallet"
              onPress={handleImportWallet}
              variant="secondary"
              isDark
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    zIndex: 20,
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 24,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    paddingBottom: 20,
  },
  headline: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 52,
    letterSpacing: -1.5,
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
