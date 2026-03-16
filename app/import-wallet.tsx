import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

type ImportMethod = 'phrase' | 'privateKey';

export default function ImportWalletScreen() {
  const [method, setMethod] = useState<ImportMethod>('phrase');
  const [inputValue, setInputValue] = useState('');

  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  useEffect(() => {
    contentOpacity.value = withDelay(
      150,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    contentTranslateY.value = withDelay(
      150,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const hasInput = inputValue.trim().length > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header — instant */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Import Wallet</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* All content slides up once */}
      <Animated.View style={[styles.scrollContent, animStyle]}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="download" size={48} color="#fff" />
          </View>
        </View>

        {/* Title + subtitle */}
        <Text style={styles.title}>Restore your{'\n'}wallet</Text>
        <Text style={styles.subtitle}>
          Import an existing wallet using your recovery phrase or private key.
        </Text>

        {/* Method tabs — frosted glass */}
        <View style={styles.tabOuter}>
          <BlurView intensity={20} tint="dark" style={styles.tabBlur}>
            <View style={styles.tabContainer}>
              <Pressable
                onPress={() => { setMethod('phrase'); setInputValue(''); }}
                style={[styles.tab, method === 'phrase' && styles.tabActive]}
              >
                <Text style={[styles.tabText, method === 'phrase' && styles.tabTextActive]}>
                  Recovery Phrase
                </Text>
              </Pressable>
              <Pressable
                onPress={() => { setMethod('privateKey'); setInputValue(''); }}
                style={[styles.tab, method === 'privateKey' && styles.tabActive]}
              >
                <Text style={[styles.tabText, method === 'privateKey' && styles.tabTextActive]}>
                  Private Key
                </Text>
              </Pressable>
            </View>
          </BlurView>
        </View>

        {/* Input — frosted glass */}
        <View style={styles.inputOuter}>
          <BlurView intensity={15} tint="dark" style={styles.inputBlur}>
            <View style={styles.inputInner}>
              <TextInput
                style={styles.textInput}
                placeholder={
                  method === 'phrase'
                    ? 'Enter your 12 or 24 word recovery phrase...'
                    : 'Enter your private key (0x...)...'
                }
                placeholderTextColor="rgba(255,255,255,0.2)"
                multiline
                value={inputValue}
                onChangeText={setInputValue}
                autoCapitalize="none"
                autoCorrect={false}
                textAlignVertical="top"
                selectionColor="rgba(255,255,255,0.4)"
              />
              {inputValue.length > 0 && (
                <Pressable
                  onPress={() => setInputValue('')}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.3)" />
                </Pressable>
              )}
            </View>
          </BlurView>
        </View>

        {/* Paste row */}
        <Pressable style={styles.pasteRow}>
          <Ionicons name="clipboard-outline" size={16} color="rgba(255,255,255,0.5)" />
          <Text style={styles.pasteText}>Paste from clipboard</Text>
        </Pressable>
      </Animated.View>

      {/* CTA button */}
      <Animated.View style={[styles.bottomSection, animStyle]}>
        <Pressable
          onPress={() => {
            // TODO: Validate and import wallet
          }}
          disabled={!hasInput}
          style={({ pressed }) => [
            styles.ctaButton,
            !hasInput && styles.ctaButtonDisabled,
            pressed && hasInput && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={[styles.ctaText, !hasInput && styles.ctaTextDisabled]}>
            Import Wallet
          </Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color={hasInput ? '#000' : 'rgba(255,255,255,0.25)'}
            style={{ marginLeft: 8 }}
          />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.3,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 28,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 38,
    letterSpacing: -0.8,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 22,
    marginBottom: 24,
  },
  tabOuter: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 20,
  },
  tabBlur: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 11,
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.35)',
  },
  tabTextActive: {
    color: '#fff',
  },
  inputOuter: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 12,
  },
  inputBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  inputInner: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    position: 'relative',
  },
  textInput: {
    minHeight: 120,
    padding: 16,
    fontSize: 15,
    color: '#fff',
    lineHeight: 22,
  },
  clearButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  pasteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  pasteText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
    marginLeft: 6,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 44,
    paddingTop: 16,
  },
  ctaButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.3,
  },
  ctaTextDisabled: {
    color: 'rgba(255,255,255,0.25)',
  },
});
