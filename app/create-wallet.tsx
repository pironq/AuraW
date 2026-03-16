import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
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
  withTiming,
} from 'react-native-reanimated';

import AuraLogo from '@/components/AuraLogo';

export default function CreateWalletScreen() {
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(28);

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
      </View>

      <Animated.View style={[styles.content, animStyle]}>
        {/* Logo + centered title block */}
        <View style={styles.heroSection}>
          <AuraLogo size={56} isDark />
          <Text style={styles.title}>NEW WALLET</Text>
          <Text style={styles.subtitle}>
            A 12-word secret phrase will be generated.{'\n'}This is the master key to your wallet.
          </Text>
        </View>

        {/* 3 step cards — frosted glass */}
        <View style={styles.stepsContainer}>
          <StepCard
            icon="eye-off-outline"
            label="Privacy first"
            text="Find a quiet spot — no cameras, no onlookers."
          />
          <StepCard
            icon="key-outline"
            label="Your secret phrase"
            text="12 words will be generated. Write them down on paper."
          />
          <StepCard
            icon="lock-closed-outline"
            label="Keep it safe"
            text="Lose the phrase, lose the wallet. Store it offline."
          />
        </View>

        {/* Warning banner — frosted with accent line */}
        <View style={styles.warningOuter}>
          <BlurView intensity={30} tint="dark" style={styles.warningBlur}>
            <View style={styles.warningInner}>
              <View style={styles.warningAccent} />
              <View style={styles.warningContent}>
                <View style={styles.warningHeader}>
                  <Ionicons name="alert-circle" size={15} color="rgba(255,255,255,0.6)" />
                  <Text style={styles.warningLabel}>Cannot be recovered</Text>
                </View>
                <Text style={styles.warningText}>
                  AuraW never stores your phrase. If lost, your funds are gone — no exceptions.
                </Text>
              </View>
            </View>
          </BlurView>
        </View>
      </Animated.View>

      {/* Bottom CTA */}
      <Animated.View style={[styles.bottomSection, animStyle]}>
        <Pressable
          onPress={() => {
            // TODO: Navigate to seed phrase generation
          }}
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.ctaText}>Ready, let's go</Text>
          <Ionicons name="arrow-forward" size={17} color="#000" style={{ marginLeft: 8 }} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

function StepCard({ icon, label, text }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  text: string;
}) {
  return (
    <View style={styles.cardOuter}>
      <BlurView intensity={18} tint="dark" style={styles.cardBlur}>
        <View style={styles.cardInner}>
          <View style={styles.cardIconWrap}>
            <Ionicons name={icon} size={18} color="rgba(255,255,255,0.8)" />
          </View>
          <View style={styles.cardTextWrap}>
            <Text style={styles.cardLabel}>{label}</Text>
            <Text style={styles.cardText}>{text}</Text>
          </View>
        </View>
      </BlurView>
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // ── Hero ──
  heroSection: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 5,
    marginTop: 16,
    marginBottom: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 21,
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  // ── Step cards ──
  stepsContainer: {
    gap: 10,
    marginBottom: 20,
  },
  cardOuter: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  cardBlur: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  cardIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardTextWrap: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  cardText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },

  // ── Warning banner ──
  warningOuter: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  warningBlur: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  warningInner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.025)',
  },
  warningAccent: {
    width: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  warningContent: {
    flex: 1,
    padding: 16,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  warningLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.55)',
    marginLeft: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  warningText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 19,
  },

  // ── Bottom ──
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
