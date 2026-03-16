import { Ionicons } from '@expo/vector-icons';
import * as ExpoClipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
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
    withTiming,
} from 'react-native-reanimated';

import AuraLogo from '@/components/AuraLogo';

export default function SeedPhraseScreen() {
  const { phrase } = useLocalSearchParams<{ phrase: string }>();
  const words = (phrase || '').split(' ');
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(24);

  useEffect(() => {
    contentOpacity.value = withDelay(
      100,
      withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) })
    );
    contentTranslateY.value = withDelay(
      100,
      withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const handleCopy = async () => {
    try {
      await ExpoClipboard.setStringAsync(phrase || '');
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      Alert.alert('Error', 'Could not copy to clipboard.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.header}>
        <View style={{ width: 40 }} />
      </View>

      <Animated.View style={[styles.content, animStyle]}>
        <View style={styles.heroSection}>
          <AuraLogo size={48} isDark />
          <Text style={styles.title}>YOUR SECRET PHRASE</Text>
          <Text style={styles.subtitle}>
            Write these 12 words down in order.{'\n'}Do not share them with anyone.
          </Text>
        </View>

        {/* Word grid */}
        <View style={styles.wordGrid}>
          {words.map((word, i) => (
            <View key={i} style={styles.wordBox}>
              <Text style={styles.wordNumber}>{i + 1}</Text>
              <Text style={styles.wordText}>{word}</Text>
            </View>
          ))}
        </View>

        {/* Copy button */}
        <Pressable
          onPress={handleCopy}
          style={styles.copyButton}
          accessibilityRole="button"
          accessibilityLabel={copied ? 'Copied to clipboard' : 'Copy seed phrase to clipboard'}
          accessibilityState={{ selected: copied }}
        >
          <Ionicons
            name={copied ? 'checkmark-circle' : 'copy-outline'}
            size={15}
            color={copied ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)'}
          />
          <Text style={[styles.copyText, copied && { color: 'rgba(255,255,255,0.7)' }]}>
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </Text>
        </Pressable>
      </Animated.View>

      {/* Bottom CTA */}
      <Animated.View style={[styles.bottomSection, animStyle]}>
        <Pressable
          onPress={() => router.push({ pathname: '/verify-phrase', params: { phrase: phrase || '' } })}
          accessibilityRole="button"
          accessibilityLabel="I have saved my seed phrase"
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.ctaText}>I've saved it</Text>
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
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 4,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 4,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 21,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  wordBox: {
    width: '31%' as any,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 10,
  },
  wordNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.2)',
    width: 18,
    letterSpacing: 0.5,
  },
  wordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  copyText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    marginLeft: 6,
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
