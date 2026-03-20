import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import TokenIcon from '@/components/TokenIcon';

export default function SendConfirmScreen() {
  const params = useLocalSearchParams<{
    symbol: string;
    name: string;
    network: string;
    amount: string;
    fiatValue: string;
    toAddress: string;
  }>();

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const isMountedRef = useRef(true);
  const sendTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mock network fee
  const networkFee = '0.0012';
  const networkFeeFiat = '3.18';

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const handleConfirm = async () => {
    setSending(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate transaction
    sendTimeoutRef.current = setTimeout(async () => {
      if (!isMountedRef.current) return;
      setSending(false);
      setSuccess(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (sendTimeoutRef.current) {
        clearTimeout(sendTimeoutRef.current);
      }
    };
  }, []);

  const handleDone = () => {
    router.dismissAll();
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Confirm</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Transaction Summary */}
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(300)} style={styles.amountCard}>
          <Text style={styles.sendingLabel}>You're sending</Text>
          <View style={styles.amountRow}>
            <TokenIcon
              symbol={params.symbol || 'ETH'}
              size={48}
              showChainBadge={(params.network || 'ethereum') !== 'ethereum'}
              chain={params.network || 'ethereum'}
            />
            <View style={styles.amountInfo}>
              <Text style={styles.amountValue}>
                {parseFloat(params.amount || '0').toFixed(6)} {params.symbol}
              </Text>
              <Text style={styles.amountFiat}>${params.fiatValue} USD</Text>
            </View>
          </View>
        </Animated.View>

        {/* Details */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>To</Text>
            <View style={styles.detailValueRow}>
              <Text style={styles.detailAddress}>
                {truncateAddress(params.toAddress || '')}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Network</Text>
            <Text style={styles.detailValue}>
              {(params.network || 'ethereum').charAt(0).toUpperCase() +
                (params.network || 'ethereum').slice(1)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Network Fee</Text>
            <View style={styles.detailValueCol}>
              <Text style={styles.detailValue}>{networkFee} ETH</Text>
              <Text style={styles.detailSubValue}>${networkFeeFiat}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabelBold}>Total</Text>
            <View style={styles.detailValueCol}>
              <Text style={styles.detailValueBold}>
                {params.symbol === 'ETH'
                  ? `${(parseFloat(params.amount || '0') + parseFloat(networkFee)).toFixed(6)} ETH`
                  : `${parseFloat(params.amount || '0').toFixed(6)} ${params.symbol} + ${networkFee} ETH`}
              </Text>
              <Text style={styles.detailSubValue}>
                ${(parseFloat(params.fiatValue || '0') + parseFloat(networkFeeFiat)).toFixed(2)}
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.confirmBtn, sending && styles.confirmBtnSending]}
          onPress={handleConfirm}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <Text style={styles.confirmBtnText}>Confirm & Send</Text>
          )}
        </Pressable>
      </View>

      {/* Success Modal */}
      <Modal visible={success} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeIn.duration(300)} style={styles.successCard}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={40} color="#4ade80" />
            </View>
            <Text style={styles.successTitle}>Sent!</Text>
            <Text style={styles.successAmount}>
              {parseFloat(params.amount || '0').toFixed(6)} {params.symbol}
            </Text>
            <Text style={styles.successTo}>
              To {truncateAddress(params.toAddress || '')}
            </Text>

            <View style={styles.successDetails}>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Transaction Hash</Text>
                <Text style={styles.successDetailValue}>0x8f2e...4aBc</Text>
              </View>
            </View>

            <Pressable style={styles.doneBtn} onPress={handleDone}>
              <Text style={styles.doneBtnText}>Done</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
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
  amountCard: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 16,
  },
  sendingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  amountInfo: {
    alignItems: 'flex-start',
  },
  amountValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  amountFiat: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  detailsCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  detailLabelBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  detailValueBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailValueCol: {
    alignItems: 'flex-end',
  },
  detailAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'monospace',
  },
  detailSubValue: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.35)',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  confirmBtn: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmBtnSending: {
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successCard: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(74,222,128,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  successAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  successTo: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 24,
  },
  successDetails: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginBottom: 24,
  },
  successDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successDetailLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  successDetailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'monospace',
  },
  doneBtn: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
});
