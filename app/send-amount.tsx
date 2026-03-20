import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import TokenIcon from '@/components/TokenIcon';

export default function SendAmountScreen() {
  const params = useLocalSearchParams<{
    symbol: string;
    name: string;
    network: string;
    balance: string;
    value: string;
  }>();

  const [amount, setAmount] = useState('');
  const [isFiatMode, setIsFiatMode] = useState(false);

  // Parse current token price from value/balance
  const tokenPrice = parseFloat(params.value?.replace(/[$,]/g, '') || '0') /
    parseFloat(params.balance || '1');

  // Calculate equivalent value
  const numericAmount = parseFloat(amount) || 0;
  const fiatValue = isFiatMode
    ? numericAmount
    : numericAmount * tokenPrice;
  const tokenAmount = isFiatMode
    ? numericAmount / tokenPrice
    : numericAmount;

  const maxBalance = parseFloat(params.balance || '0');
  const isValidAmount = tokenAmount > 0 && tokenAmount <= maxBalance;

  const handleMaxPress = () => {
    setAmount(isFiatMode
      ? (maxBalance * tokenPrice).toFixed(2)
      : params.balance || '0');
  };

  const handleContinue = () => {
    if (!isValidAmount) return;
    router.push({
      pathname: '/send-address',
      params: {
        ...params,
        amount: tokenAmount.toString(),
        fiatValue: fiatValue.toFixed(2),
      },
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
        <Text style={styles.title}>Amount</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Token Info */}
      <Animated.View entering={FadeInDown.duration(300)} style={styles.tokenCard}>
        <TokenIcon
          symbol={params.symbol || 'ETH'}
          size={48}
          showChainBadge={(params.network || 'ethereum') !== 'ethereum'}
          chain={params.network || 'ethereum'}
        />
        <View style={styles.tokenInfo}>
          <Text style={styles.tokenSymbol}>{params.symbol}</Text>
          <Text style={styles.tokenBalance}>
            Balance: {params.balance} {params.symbol}
          </Text>
        </View>
      </Animated.View>

      {/* Amount Input */}
      <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.amountSection}>
        <View style={styles.amountRow}>
          <Text style={styles.currencyPrefix}>
            {isFiatMode ? '$' : ''}
          </Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0"
            placeholderTextColor="rgba(255,255,255,0.2)"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
          {!isFiatMode && (
            <Text style={styles.tokenSuffix}>{params.symbol}</Text>
          )}
        </View>

        {/* Equivalent value */}
        <Pressable
          style={styles.equivalentRow}
          onPress={() => {
            const newAmount = isFiatMode
              ? (numericAmount / tokenPrice).toString()
              : (numericAmount * tokenPrice).toFixed(2);
            setAmount(newAmount === 'NaN' || newAmount === 'Infinity' ? '' : newAmount);
            setIsFiatMode(!isFiatMode);
          }}
        >
          <Ionicons name="swap-vertical" size={14} color="rgba(255,255,255,0.4)" />
          <Text style={styles.equivalentText}>
            {isFiatMode
              ? `${tokenAmount.toFixed(6)} ${params.symbol}`
              : `$${fiatValue.toFixed(2)} USD`}
          </Text>
        </Pressable>

        {/* Quick amounts */}
        <View style={styles.quickAmounts}>
          <Pressable
            style={styles.quickBtn}
            onPress={() => setAmount(isFiatMode
              ? ((maxBalance * tokenPrice) * 0.25).toFixed(2)
              : (maxBalance * 0.25).toFixed(6))}
          >
            <Text style={styles.quickBtnText}>25%</Text>
          </Pressable>
          <Pressable
            style={styles.quickBtn}
            onPress={() => setAmount(isFiatMode
              ? ((maxBalance * tokenPrice) * 0.5).toFixed(2)
              : (maxBalance * 0.5).toFixed(6))}
          >
            <Text style={styles.quickBtnText}>50%</Text>
          </Pressable>
          <Pressable
            style={styles.quickBtn}
            onPress={() => setAmount(isFiatMode
              ? ((maxBalance * tokenPrice) * 0.75).toFixed(2)
              : (maxBalance * 0.75).toFixed(6))}
          >
            <Text style={styles.quickBtnText}>75%</Text>
          </Pressable>
          <Pressable style={styles.quickBtn} onPress={handleMaxPress}>
            <Text style={styles.quickBtnText}>MAX</Text>
          </Pressable>
        </View>

        {/* Error message */}
        {numericAmount > 0 && tokenAmount > maxBalance && (
          <Text style={styles.errorText}>Insufficient balance</Text>
        )}
      </Animated.View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.continueBtn, !isValidAmount && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!isValidAmount}
        >
          <Text style={[styles.continueBtnText, !isValidAmount && styles.continueBtnTextDisabled]}>
            Continue
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
  tokenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 14,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  tokenBalance: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  amountSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyPrefix: {
    fontSize: 48,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.5)',
  },
  amountInput: {
    fontSize: 56,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    minWidth: 100,
    padding: 0,
  },
  tokenSuffix: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    marginLeft: 8,
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  equivalentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    padding: 8,
  },
  equivalentText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 32,
  },
  quickBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  quickBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#f87171',
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
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
