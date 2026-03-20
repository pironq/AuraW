import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AddWalletScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Add Wallet</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Create a new wallet or import an existing one
        </Text>

        {/* Options */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <Pressable
            style={styles.optionCard}
            onPress={() => router.push('/create-wallet')}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="add-circle-outline" size={28} color="#fff" />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Create New Wallet</Text>
              <Text style={styles.optionDesc}>
                Generate a new wallet with a fresh recovery phrase
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(300)}>
          <Pressable
            style={styles.optionCard}
            onPress={() => router.push('/import-wallet')}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="download-outline" size={28} color="#fff" />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Import Wallet</Text>
              <Text style={styles.optionDesc}>
                Use a recovery phrase or private key
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(300)}>
          <Pressable style={styles.optionCard}>
            <View style={[styles.optionIcon, styles.optionIconDisabled]}>
              <Ionicons name="hardware-chip-outline" size={28} color="rgba(255,255,255,0.4)" />
            </View>
            <View style={styles.optionInfo}>
              <Text style={[styles.optionTitle, styles.optionTitleDisabled]}>
                Connect Hardware Wallet
              </Text>
              <Text style={styles.optionDesc}>
                Ledger, Trezor, and more (Coming Soon)
              </Text>
            </View>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>

      {/* Security Note */}
      <View style={styles.securityNote}>
        <Ionicons name="shield-checkmark-outline" size={18} color="rgba(255,255,255,0.4)" />
        <Text style={styles.securityText}>
          Your keys are stored securely on your device and never leave it
        </Text>
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
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginBottom: 32,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 12,
    gap: 14,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconDisabled: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  optionTitleDisabled: {
    color: 'rgba(255,255,255,0.5)',
  },
  optionDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 18,
  },
  comingSoonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  securityText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    lineHeight: 16,
    flex: 1,
  },
});
