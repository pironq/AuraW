import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

export default function SecurityVerifyScreen() {
  const params = useLocalSearchParams<{ action: string }>();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [biometricSupported, setBiometricSupported] = useState(false);

  const shakeX = useSharedValue(0);

  // Mock PIN for demo
  const CORRECT_PIN = '123456';

  useEffect(() => {
    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricSupported(compatible && enrolled);

    if (compatible && enrolled) {
      // Auto-prompt biometric on load
      setTimeout(() => handleBiometricAuth(), 500);
    }
  };

  const handleBiometricAuth = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to continue',
      fallbackLabel: 'Use PIN',
    });

    if (result.success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigateToAction();
    }
  };

  const handlePinPress = (digit: string) => {
    if (pin.length < 6) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newPin = pin + digit;
      setPin(newPin);
      setError('');

      if (newPin.length === 6) {
        // Verify PIN
        if (newPin === CORRECT_PIN) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          navigateToAction();
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setError('Incorrect PIN');
          shakeX.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(0, { duration: 50 })
          );
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPin(pin.slice(0, -1));
    }
  };

  const navigateToAction = () => {
    switch (params.action) {
      case 'recovery-phrase':
        router.replace('/view-recovery-phrase');
        break;
      case 'private-key':
        router.replace('/view-private-key');
        break;
      case 'change-pin':
        router.replace('/change-pin');
        break;
      case 'export-wallet':
        router.replace('/export-wallet');
        break;
      default:
        router.back();
    }
  };

  const getTitle = () => {
    switch (params.action) {
      case 'recovery-phrase':
        return 'View Recovery Phrase';
      case 'private-key':
        return 'Export Private Key';
      case 'change-pin':
        return 'Change PIN';
      case 'export-wallet':
        return 'Export Wallet';
      default:
        return 'Verify Identity';
    }
  };

  const pinDotsStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>{getTitle()}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Lock Icon */}
        <Animated.View entering={FadeInDown.duration(300)} style={styles.lockIcon}>
          <Ionicons name="lock-closed" size={32} color="rgba(255,255,255,0.6)" />
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(100).duration(300)} style={styles.subtitle}>
          Enter your PIN to continue
        </Animated.Text>

        {/* PIN Dots */}
        <Animated.View style={[styles.pinDots, pinDotsStyle]}>
          {[...Array(6)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.pinDot,
                i < pin.length && styles.pinDotFilled,
                error && styles.pinDotError,
              ]}
            />
          ))}
        </Animated.View>

        {/* Error */}
        {error && (
          <Animated.Text entering={FadeIn.duration(200)} style={styles.errorText}>
            {error}
          </Animated.Text>
        )}

        {/* Keypad */}
        <View style={styles.keypad}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            [biometricSupported ? 'biometric' : '', '0', 'delete'],
          ].map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((key, keyIndex) => {
                if (key === '') {
                  return <View key={keyIndex} style={styles.keyEmpty} />;
                }
                if (key === 'biometric') {
                  return (
                    <Pressable
                      key={keyIndex}
                      style={styles.key}
                      onPress={handleBiometricAuth}
                    >
                      <Ionicons name="finger-print" size={28} color="#fff" />
                    </Pressable>
                  );
                }
                if (key === 'delete') {
                  return (
                    <Pressable
                      key={keyIndex}
                      style={styles.key}
                      onPress={handleDelete}
                      onLongPress={() => setPin('')}
                    >
                      <Ionicons name="backspace-outline" size={26} color="#fff" />
                    </Pressable>
                  );
                }
                return (
                  <Pressable
                    key={keyIndex}
                    style={styles.key}
                    onPress={() => handlePinPress(key)}
                  >
                    <Text style={styles.keyText}>{key}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 58,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  lockIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 32,
  },
  pinDots: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pinDotFilled: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  pinDotError: {
    backgroundColor: '#f87171',
    borderColor: '#f87171',
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#f87171',
    marginBottom: 16,
  },
  keypad: {
    marginTop: 'auto',
    paddingBottom: 40,
    paddingHorizontal: 40,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 16,
  },
  key: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#fff',
  },
  keyEmpty: {
    width: 72,
    height: 72,
  },
});
