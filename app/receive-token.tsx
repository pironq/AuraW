import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Pressable,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

import TokenIcon from '@/components/TokenIcon';

// Mock transaction history for this token
const MOCK_HISTORY = [
  { type: 'receive', amount: '+0.5 ETH', value: '$1,322.90', from: '0x8f2...4aB', time: '3d ago' },
  { type: 'receive', amount: '+0.25 ETH', value: '$661.45', from: '0x3a1...9fE', time: '1w ago' },
  { type: 'receive', amount: '+1.0 ETH', value: '$2,645.80', from: '0x7c4...2dF', time: '2w ago' },
];

export default function ReceiveTokenScreen() {
  const params = useLocalSearchParams<{
    symbol: string;
    name: string;
    network: string;
  }>();

  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mock wallet address
  const walletAddress = '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b';
  const truncatedAddress = `${walletAddress.slice(0, 10)}...${walletAddress.slice(-8)}`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(walletAddress);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    await Share.share({
      message: `My ${params.symbol} address: ${walletAddress}`,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Receive {params.symbol}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* QR Code Card */}
        <Animated.View entering={FadeInDown.duration(300)} style={styles.qrCard}>
          <View style={styles.tokenHeader}>
            <TokenIcon
              symbol={params.symbol || 'ETH'}
              size={40}
              showChainBadge={(params.network || 'ethereum') !== 'ethereum'}
              chain={params.network || 'ethereum'}
            />
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenName}>{params.name || params.symbol || 'Token'}</Text>
              <Text style={styles.networkLabel}>
                {(params.network || 'ethereum').charAt(0).toUpperCase() +
                  (params.network || 'ethereum').slice(1)} Network
              </Text>
            </View>
          </View>

          <View style={styles.qrContainer}>
            <View style={styles.qrWrapper}>
              <QRCode
                value={walletAddress}
                size={180}
                color="#000"
                backgroundColor="#fff"
              />
            </View>
          </View>

          <View style={styles.addressSection}>
            <Text style={styles.addressLabel}>Your Address</Text>
            <Text style={styles.addressText}>{truncatedAddress}</Text>
          </View>

          <View style={styles.actionButtons}>
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
                  <Text style={styles.actionBtnText}>Copy</Text>
                </View>
              )}
            </Pressable>

            <Pressable style={styles.actionBtn} onPress={handleShare}>
              <View style={styles.actionBtnInner}>
                <Ionicons name="share-outline" size={20} color="#fff" />
                <Text style={styles.actionBtnText}>Share</Text>
              </View>
            </Pressable>
          </View>
        </Animated.View>

        {/* Warning */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.warningCard}>
          <Ionicons name="warning-outline" size={18} color="#fbbf24" />
          <Text style={styles.warningText}>
            Only send {params.symbol} on{' '}
            {(params.network || 'ethereum').charAt(0).toUpperCase() +
              (params.network || 'ethereum').slice(1)}{' '}
            network to this address. Sending other tokens may result in permanent loss.
          </Text>
        </Animated.View>

        {/* Transaction History */}
        <Animated.View entering={FadeInDown.delay(200).duration(300)}>
          <Text style={styles.sectionTitle}>Recent Received</Text>
          {MOCK_HISTORY.map((tx, index) => (
            <Pressable key={index} style={styles.historyRow}>
              <View style={styles.historyIcon}>
                <Ionicons name="arrow-down" size={18} color="#4ade80" />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyAmount}>{tx.amount}</Text>
                <Text style={styles.historyFrom}>From {tx.from} · {tx.time}</Text>
              </View>
              <Text style={styles.historyValue}>{tx.value}</Text>
            </Pressable>
          ))}
        </Animated.View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  qrCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  networkLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrWrapper: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
  },
  addressSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 6,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
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
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(251,191,36,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.15)',
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(251,191,36,0.9)',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 28,
    marginBottom: 12,
    marginLeft: 4,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginBottom: 6,
    gap: 12,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(74,222,128,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyInfo: {
    flex: 1,
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4ade80',
    marginBottom: 2,
  },
  historyFrom: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.35)',
  },
  historyValue: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
});
