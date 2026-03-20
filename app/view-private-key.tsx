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

// Mock private key
const MOCK_PRIVATE_KEY = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

export default function ViewPrivateKeyScreen() {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(MOCK_PRIVATE_KEY);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrivateKey = (key: string) => {
    // Split into groups of 8 characters for readability
    const chunks = [];
    for (let i = 0; i < key.length; i += 16) {
      chunks.push(key.slice(i, i + 16));
    }
    return chunks;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Private Key</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Danger Warning */}
        <Animated.View entering={FadeInDown.duration(300)} style={styles.dangerCard}>
          <Ionicons name="alert-circle-outline" size={20} color="#f87171" />
          <View style={styles.dangerContent}>
            <Text style={styles.dangerTitle}>Extreme Caution Required</Text>
            <Text style={styles.dangerText}>
              Your private key provides full access to your wallet. Never share it, screenshot it, or enter it on any website.
            </Text>
          </View>
        </Animated.View>

        {/* Private Key Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.keyCard}>
          {!revealed ? (
            <Pressable style={styles.revealOverlay} onPress={() => setRevealed(true)}>
              <View style={styles.revealIcon}>
                <Ionicons name="key-outline" size={32} color="rgba(255,255,255,0.5)" />
              </View>
              <Text style={styles.revealText}>Tap to reveal private key</Text>
              <Text style={styles.revealSubtext}>Make sure no one is watching your screen</Text>
            </Pressable>
          ) : (
            <View style={styles.keyContent}>
              <Text style={styles.keyLabel}>Your Private Key</Text>
              <View style={styles.keyBox}>
                {formatPrivateKey(MOCK_PRIVATE_KEY).map((chunk, i) => (
                  <Text key={i} style={styles.keyText}>{chunk}</Text>
                ))}
              </View>
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
                  <Text style={styles.actionBtnText}>Copy Key</Text>
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

        {/* Security Tips */}
        <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Security Tips</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color="rgba(74,222,128,0.8)" />
            <Text style={styles.tipText}>Store in a secure password manager</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color="rgba(74,222,128,0.8)" />
            <Text style={styles.tipText}>Write down and store in a safe place</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="close-circle-outline" size={16} color="rgba(248,113,113,0.8)" />
            <Text style={styles.tipText}>Never share with anyone</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="close-circle-outline" size={16} color="rgba(248,113,113,0.8)" />
            <Text style={styles.tipText}>Never enter on websites or apps</Text>
          </View>
        </Animated.View>
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
  dangerCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(248,113,113,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.15)',
    marginBottom: 20,
  },
  dangerContent: {
    flex: 1,
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f87171',
    marginBottom: 4,
  },
  dangerText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(248,113,113,0.8)',
    lineHeight: 18,
  },
  keyCard: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    minHeight: 180,
  },
  revealOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  keyContent: {
    padding: 20,
  },
  keyLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  keyBox: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  keyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
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
  tipsCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
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
