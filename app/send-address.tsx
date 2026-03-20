import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import TokenIcon from '@/components/TokenIcon';

// Mock recent addresses
const RECENT_ADDRESSES = [
  { address: '0x8f2e1234567890abcdef1234567890abcdef4aBc', label: 'John Doe', time: '2 days ago' },
  { address: '0x3a1D0987654321abcdef1234567890abcdef9fEe', label: 'Trading Wallet', time: '1 week ago' },
];

const truncateAddress = (value: string) => `${value.slice(0, 8)}...${value.slice(-6)}`;

export default function SendAddressScreen() {
  const params = useLocalSearchParams<{
    symbol: string;
    name: string;
    network: string;
    balance: string;
    amount: string;
    fiatValue: string;
    scannedAddress?: string;
  }>();

  const [address, setAddress] = useState('');

  useEffect(() => {
    if (typeof params.scannedAddress === 'string' && params.scannedAddress.length > 0) {
      setAddress(params.scannedAddress);
    }
  }, [params.scannedAddress]);

  // Simple Ethereum address validation
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text?.trim()) {
        setAddress(text.trim());
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      Alert.alert('Clipboard error', 'Unable to access clipboard right now.');
    }
  };

  const handleScanQR = () => {
    router.push({
      pathname: '/qr-scanner',
      params: {
        returnTo: '/send-address',
        ...params,
      },
    });
  };

  const handleContinue = () => {
    if (!isValidAddress) return;
    router.push({
      pathname: '/send-confirm',
      params: {
        ...params,
        toAddress: address,
      },
    });
  };

  const handleSelectRecent = (recentAddress: string) => {
    setAddress(recentAddress);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Recipient</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Summary Card */}
      <Animated.View entering={FadeInDown.duration(300)} style={styles.summaryCard}>
        <TokenIcon
          symbol={params.symbol || 'ETH'}
          size={40}
          showChainBadge={(params.network || 'ethereum') !== 'ethereum'}
          chain={params.network || 'ethereum'}
        />
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryAmount}>
            {(Number.isFinite(Number(params.amount || '0')) ? Number(params.amount || '0') : 0).toFixed(6)} {params.symbol}
          </Text>
          <Text style={styles.summaryValue}>
            ${(Number.isFinite(Number(params.fiatValue)) ? Number(params.fiatValue) : 0).toFixed(2)} USD
          </Text>
        </View>
      </Animated.View>

      {/* Address Input */}
      <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.inputSection}>
        <Text style={styles.inputLabel}>Send to</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.addressInput}
            placeholder="Enter address"
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={address}
            onChangeText={setAddress}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.inputActions}>
            <Pressable style={styles.inputActionBtn} onPress={handlePaste}>
              <Ionicons name="clipboard-outline" size={18} color="rgba(255,255,255,0.5)" />
            </Pressable>
            <Pressable style={styles.inputActionBtn} onPress={handleScanQR}>
              <Ionicons name="scan-outline" size={18} color="rgba(255,255,255,0.5)" />
            </Pressable>
          </View>
        </View>

        {/* Address validation feedback */}
        {address.length > 0 && !isValidAddress && (
          <Text style={styles.errorText}>Enter a valid Ethereum address</Text>
        )}
        {isValidAddress && (
          <View style={styles.validAddress}>
            <Ionicons name="checkmark-circle" size={14} color="#4ade80" />
            <Text style={styles.validText}>Valid address</Text>
          </View>
        )}
      </Animated.View>

      {/* Recent Addresses */}
      <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent</Text>
        {RECENT_ADDRESSES.map((item, index) => (
          <Pressable
            key={index}
            style={styles.recentRow}
            onPress={() => handleSelectRecent(item.address)}
          >
            <View style={styles.recentIcon}>
              <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.5)" />
            </View>
            <View style={styles.recentInfo}>
              <Text style={styles.recentLabel}>{item.label}</Text>
              <Text style={styles.recentAddress}>{truncateAddress(item.address)}</Text>
            </View>
            <Text style={styles.recentTime}>{item.time}</Text>
          </Pressable>
        ))}
      </Animated.View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.continueBtn, !isValidAddress && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!isValidAddress}
        >
          <Text style={[styles.continueBtnText, !isValidAddress && styles.continueBtnTextDisabled]}>
            Review
          </Text>
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
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 12,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  inputSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 10,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingLeft: 16,
    paddingRight: 8,
  },
  addressInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
    paddingVertical: 14,
  },
  inputActions: {
    flexDirection: 'row',
    gap: 4,
  },
  inputActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#f87171',
    marginTop: 8,
    marginLeft: 4,
  },
  validAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginLeft: 4,
  },
  validText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4ade80',
  },
  recentSection: {
    paddingHorizontal: 16,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginBottom: 6,
    gap: 12,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentInfo: {
    flex: 1,
  },
  recentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  recentAddress: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.35)',
  },
  recentTime: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.25)',
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  continueBtn: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  continueBtnTextDisabled: {
    color: 'rgba(255,255,255,0.3)',
  },
});
