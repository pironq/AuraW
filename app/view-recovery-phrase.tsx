import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

// Mock recovery phrase
const MOCK_PHRASE = [
  'abandon', 'ability', 'able', 'about',
  'above', 'absent', 'absorb', 'abstract',
  'absurd', 'abuse', 'access', 'accident',
];

export default function ViewRecoveryPhraseScreen() {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(MOCK_PHRASE.join(' '));
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Recovery Phrase</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Warning */}
        <Animated.View entering={FadeInDown.duration(300)} style={styles.warningCard}>
          <Ionicons name="warning-outline" size={20} color="#fbbf24" />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Keep this secret!</Text>
            <Text style={styles.warningText}>
              Never share your recovery phrase. Anyone with these words can access your wallet and steal your funds.
            </Text>
          </View>
        </Animated.View>

        {/* Phrase Grid */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.phraseCard}>
          {!revealed ? (
            <Pressable style={styles.revealOverlay} onPress={() => setRevealed(true)}>
              <View style={styles.revealIcon}>
                <Ionicons name="eye-off-outline" size={32} color="rgba(255,255,255,0.5)" />
              </View>
              <Text style={styles.revealText}>Tap to reveal</Text>
              <Text style={styles.revealSubtext}>Make sure no one is watching</Text>
            </Pressable>
          ) : (
            <View style={styles.phraseGrid}>
              {MOCK_PHRASE.map((word, index) => (
                <View key={index} style={styles.wordBox}>
                  <Text style={styles.wordNumber}>{index + 1}</Text>
                  <Text style={styles.wordText}>{word}</Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>

        {/* Actions */}
        {revealed && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.actions}>
            <Pressable style={styles.actionBtn} onPress={handleCopy}>
              {copied ? (
                <Animated.View
                  entering={FadeIn.duration(150)}
                  exiting={FadeOut.duration(150)}
                  style={styles.actionBtnInner}
                >
                  <Ionicons name="checkmark" size={20} color="#4ade80" />
                  <Text style={[styles.actionBtnText, { color: '#4ade80' }]}>Copied!</Text>
                </Animated.View>
              ) : (
                <View style={styles.actionBtnInner}>
                  <Ionicons name="copy-outline" size={20} color="#fff" />
                  <Text style={styles.actionBtnText}>Copy Phrase</Text>
                </View>
              )}
            </Pressable>

            <Pressable style={styles.actionBtn} onPress={() => setRevealed(false)}>
              <View style={styles.actionBtnInner}>
                <Ionicons name="eye-off-outline" size={20} color="#fff" />
                <Text style={styles.actionBtnText}>Hide</Text>
              </View>
            </Pressable>
          </Animated.View>
        )}
      </View>

      {/* Done Button */}
      <View style={styles.footer}>
        <Pressable style={styles.doneBtn} onPress={() => router.back()}>
          <Text style={styles.doneBtnText}>Done</Text>
        </Pressable>
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
    paddingHorizontal: 16,
  },
  warningCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(251,191,36,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.15)',
    marginBottom: 20,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fbbf24',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(251,191,36,0.8)',
    lineHeight: 18,
  },
  phraseCard: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    minHeight: 280,
  },
  revealOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  revealIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  revealText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  revealSubtext: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  phraseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  wordBox: {
    width: '31%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  wordNumber: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.3)',
    width: 16,
  },
  wordText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  doneBtn: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
});
