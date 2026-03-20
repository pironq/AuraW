import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as ExpoClipboard from 'expo-clipboard';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
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

type ImportMethod = 'phrase' | 'privateKey';
type WordCount = 12 | 24;

export default function ImportWalletScreen() {
  const [method, setMethod] = useState<ImportMethod>('phrase');
  const [wordCount, setWordCount] = useState<WordCount>(12);
  const [words, setWords] = useState<string[]>(Array(12).fill(''));
  const [privateKey, setPrivateKey] = useState('');
  const inputRefs = useRef<(TextInput | null)[]>([]);

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

  const isComplete = method === 'phrase'
    ? words.every(w => w.trim().length > 0)
    : privateKey.trim().length > 0;

  const hasInput = method === 'phrase'
    ? words.some(w => w.trim().length > 0)
    : privateKey.trim().length > 0;

  const switchWordCount = (count: WordCount) => {
    setWordCount(count);
    setWords(Array(count).fill(''));
    inputRefs.current = [];
  };

  const handlePaste = async () => {
    let text: string;
    try {
      text = await ExpoClipboard.getStringAsync();
    } catch {
      Alert.alert('Clipboard error', 'Could not read from clipboard. Please check app permissions.');
      return;
    }
    if (!text) return;
    if (method === 'phrase') {
      const parsed = text.trim().toLowerCase().split(/\s+/);
      if (parsed.length > 12 && wordCount === 12) {
        switchWordCount(24);
        const newWords = Array(24).fill('');
        parsed.slice(0, 24).forEach((w, i) => { newWords[i] = w; });
        setTimeout(() => {
          setWords(newWords);
          Keyboard.dismiss();
        }, 50);
        return;
      }
      const newWords = Array(wordCount).fill('');
      parsed.slice(0, wordCount).forEach((w, i) => { newWords[i] = w; });
      setWords(newWords);
      Keyboard.dismiss();
    } else {
      setPrivateKey(text.trim());
    }
  };

  const handleWordChange = (text: string, index: number) => {
    const parts = text.trim().split(/\s+/);
    if (parts.length > 1) {
      // Auto-detect 24 words
      if (parts.length > 12 && wordCount === 12) {
        switchWordCount(24);
        const newWords = Array(24).fill('');
        parts.slice(0, 24).forEach((word, i) => { newWords[i] = word.toLowerCase(); });
        setTimeout(() => {
          setWords(newWords);
          const nextIdx = Math.min(parts.length, 23);
          setTimeout(() => inputRefs.current[nextIdx]?.focus(), 50);
        }, 50);
        return;
      }
      const newWords = [...words];
      parts.forEach((word, i) => {
        if (index + i < wordCount) newWords[index + i] = word.toLowerCase();
      });
      setWords(newWords);
      const nextIdx = Math.min(index + parts.length, wordCount - 1);
      setTimeout(() => inputRefs.current[nextIdx]?.focus(), 50);
      return;
    }
    if (text.endsWith(' ') && text.trim().length > 0) {
      const newWords = [...words];
      newWords[index] = text.trim().toLowerCase();
      setWords(newWords);
      if (index < wordCount - 1) inputRefs.current[index + 1]?.focus();
      return;
    }
    const newWords = [...words];
    newWords[index] = text.toLowerCase();
    setWords(newWords);
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && words[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const filledCount = words.filter(w => w.trim().length > 0).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
          <Animated.View style={animStyle}>
            {/* Hero */}
            <View style={styles.heroSection}>
              <AuraLogo size={56} isDark />
              <Text style={styles.title}>IMPORT WALLET</Text>
              <Text style={styles.subtitle}>
                Restore an existing wallet with your{'\n'}recovery phrase or private key.
              </Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabOuter}>
              <BlurView intensity={20} tint="dark" style={styles.tabBlur}>
                <View style={styles.tabRow}>
                  <Pressable
                    onPress={() => { setMethod('phrase'); setPrivateKey(''); }}
                    style={[styles.tab, method === 'phrase' && styles.tabActive]}
                  >
                    <Ionicons
                      name="grid-outline"
                      size={14}
                      color={method === 'phrase' ? '#fff' : 'rgba(255,255,255,0.3)'}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.tabText, method === 'phrase' && styles.tabTextActive]}>
                      Seed Phrase
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => { setMethod('privateKey'); setWords(Array(wordCount).fill('')); }}
                    style={[styles.tab, method === 'privateKey' && styles.tabActive]}
                  >
                    <Ionicons
                      name="key-outline"
                      size={14}
                      color={method === 'privateKey' ? '#fff' : 'rgba(255,255,255,0.3)'}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.tabText, method === 'privateKey' && styles.tabTextActive]}>
                      Private Key
                    </Text>
                  </Pressable>
                </View>
              </BlurView>
            </View>

            {method === 'phrase' ? (
              <>
                {/* Counter with inline 12/24 switcher */}
                <View style={styles.phraseHeader}>
                  <Pressable onPress={() => switchWordCount(wordCount === 12 ? 24 : 12)} style={styles.wordToggle}>
                    <Text style={styles.wordToggleText}>{wordCount} words</Text>
                    <Ionicons name="swap-horizontal" size={13} color="rgba(255,255,255,0.35)" style={{ marginLeft: 5 }} />
                  </Pressable>
                  <Text style={styles.countText}>{filledCount} of {wordCount}</Text>
                </View>

                {/* 12 word boxes — 3 columns */}
                <View style={styles.wordGrid}>
                  {words.map((word, i) => (
                    <View key={i} style={[styles.wordBoxOuter, word.length > 0 && styles.wordBoxFilled]}>
                      <Text style={styles.wordNumber}>{i + 1}</Text>
                      <TextInput
                        ref={ref => { inputRefs.current[i] = ref; }}
                        style={styles.wordInput}
                        value={word}
                        onChangeText={text => handleWordChange(text, i)}
                        onKeyPress={e => handleKeyPress(e, i)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="off"
                        spellCheck={false}
                        selectionColor="rgba(255,255,255,0.4)"
                        returnKeyType={i < wordCount - 1 ? 'next' : 'done'}
                        onSubmitEditing={() => {
                          if (i < wordCount - 1) inputRefs.current[i + 1]?.focus();
                          else Keyboard.dismiss();
                        }}
                        blurOnSubmit={false}
                      />
                    </View>
                  ))}
                </View>

                {/* Paste + Clear */}
                <View style={styles.actionRow}>
                  <Pressable onPress={handlePaste} style={styles.actionButton}>
                    <Ionicons name="clipboard-outline" size={15} color="rgba(255,255,255,0.55)" />
                    <Text style={styles.actionText}>Paste</Text>
                  </Pressable>
                  {hasInput && (
                    <Pressable
                      onPress={() => {
                        setWords(Array(wordCount).fill(''));
                        inputRefs.current[0]?.focus();
                      }}
                      style={styles.actionButton}
                    >
                      <Ionicons name="trash-outline" size={15} color="rgba(255,255,255,0.35)" />
                      <Text style={[styles.actionText, { color: 'rgba(255,255,255,0.35)' }]}>Clear all</Text>
                    </Pressable>
                  )}
                </View>
              </>
            ) : (
              <>
                <View style={styles.inputOuter}>
                  <BlurView intensity={18} tint="dark" style={styles.inputBlur}>
                    <View style={styles.inputInner}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter your private key (0x…)"
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        multiline
                        value={privateKey}
                        onChangeText={setPrivateKey}
                        autoCapitalize="none"
                        autoCorrect={false}
                        textAlignVertical="top"
                        selectionColor="rgba(255,255,255,0.4)"
                      />
                    </View>
                  </BlurView>
                </View>
                <View style={styles.actionRow}>
                  <Pressable onPress={handlePaste} style={styles.actionButton}>
                    <Ionicons name="clipboard-outline" size={15} color="rgba(255,255,255,0.55)" />
                    <Text style={styles.actionText}>Paste</Text>
                  </Pressable>
                  {hasInput && (
                    <Pressable onPress={() => setPrivateKey('')} style={styles.actionButton}>
                      <Ionicons name="trash-outline" size={15} color="rgba(255,255,255,0.35)" />
                      <Text style={[styles.actionText, { color: 'rgba(255,255,255,0.35)' }]}>Clear</Text>
                    </Pressable>
                  )}
                </View>
              </>
            )}
          </Animated.View>
        </ScrollView>

        {/* Bottom CTA */}
        <Animated.View style={[styles.bottomSection, animStyle]}>
          <Pressable
            onPress={() => {
              router.push({ pathname: '/generating', params: { mode: 'import' } });
            }}
            disabled={!isComplete}
            style={({ pressed }) => [
              styles.ctaButton,
              !isComplete && styles.ctaButtonDisabled,
              pressed && isComplete && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Text style={[styles.ctaText, !isComplete && styles.ctaTextDisabled]}>
              Restore wallet
            </Text>
            <Ionicons
              name="arrow-forward"
              size={17}
              color={isComplete ? '#000' : 'rgba(255,255,255,0.25)'}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
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
  tabOuter: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: 20,
  },
  tabBlur: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  tabRow: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 11,
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.35)',
  },
  tabTextActive: {
    color: '#fff',
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 0.3,
  },
  phraseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  wordToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  wordToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.3,
  },
  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  wordBoxOuter: {
    width: '31%' as any,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 8,
  },
  wordBoxFilled: {
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  wordNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.2)',
    width: 18,
    letterSpacing: 0.5,
  },
  wordInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    padding: 0,
    height: 40,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  actionText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '600',
    marginLeft: 6,
  },
  inputOuter: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: 12,
  },
  inputBlur: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  inputInner: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    position: 'relative',
  },
  textInput: {
    minHeight: 130,
    padding: 16,
    fontSize: 15,
    color: '#fff',
    lineHeight: 22,
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
  ctaButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.2,
  },
  ctaTextDisabled: {
    color: 'rgba(255,255,255,0.25)',
  },
});
