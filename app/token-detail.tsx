import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import TokenIcon from '@/components/TokenIcon';

// Mock recent activity per token
const MOCK_ACTIVITY: Record<string, Array<{ type: string; amount: string; value: string; address: string; time: string }>> = {
  ETH: [
    { type: 'send', amount: '-0.05 ETH', value: '$132.29', address: '0x8f2...4aB', time: '2h ago' },
    { type: 'receive', amount: '+0.5 ETH', value: '$1,322.90', address: '0x1a2...9cD', time: '3d ago' },
    { type: 'send', amount: '-0.1 ETH', value: '$264.58', address: '0x3c7...1eF', time: '5d ago' },
  ],
  USDT: [
    { type: 'receive', amount: '+250 USDT', value: '$250.00', address: '0x1a2...9cD', time: '5h ago' },
    { type: 'send', amount: '-100 USDT', value: '$100.00', address: '0x9b3...7dA', time: '2d ago' },
  ],
  USDC: [
    { type: 'receive', amount: '+126.47 USDC', value: '$126.47', address: '0x5e1...3bC', time: '1d ago' },
  ],
  ARB: [
    { type: 'receive', amount: '+45.20 ARB', value: '$52.00', address: '0x7d4...6eB', time: '4d ago' },
  ],
  LINK: [
    { type: 'receive', amount: '+3.50 LINK', value: '$48.00', address: '0x2f8...5aC', time: '1w ago' },
  ],
};

export default function TokenDetailScreen() {
  const params = useLocalSearchParams<{
    symbol: string;
    name: string;
    balance: string;
    value: string;
    price: string;
    change: string;
    positive: string;
    network: string;
    address: string;
  }>();

  const symbol = params.symbol || 'ETH';
  const name = params.name || 'Ethereum';
  const balance = params.balance || '0';
  const value = params.value || '$0.00';
  const price = params.price || '$0.00';
  const change = params.change || '0%';
  const positive = params.positive === 'true';
  const network = params.network || 'ethereum';
  const walletAddress = params.address || '0x0000000000000000000000000000000000000000';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>{symbol}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Token Icon & Info */}
        <Animated.View entering={FadeInDown.duration(350).delay(100)} style={styles.tokenSection}>
          <TokenIcon
            symbol={symbol}
            size={72}
            showChainBadge={network !== 'ethereum'}
            chain={network}
          />
          <Text style={styles.tokenName}>{name}</Text>
          <Text style={styles.tokenBalance}>{balance} {symbol}</Text>
          <Text style={styles.tokenValue}>{value}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>{price}</Text>
            <Text style={[styles.changeText, positive ? styles.positive : styles.negative]}>
              {change}
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.duration(350).delay(200)} style={styles.actionsRow}>
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push({
              pathname: '/send-amount',
              params: { symbol, name, balance, network },
            })}
          >
            <View style={styles.actionCircle}>
              <Ionicons name="arrow-up-outline" size={22} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>Send</Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => router.push({
              pathname: '/receive-token',
              params: { symbol, name, network, address: walletAddress },
            })}
          >
            <View style={styles.actionCircle}>
              <Ionicons name="arrow-down-outline" size={22} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>Receive</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={() => {}}>
            <View style={styles.actionCircle}>
              <Ionicons name="swap-horizontal-outline" size={22} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>Swap</Text>
          </Pressable>
        </Animated.View>

        {/* Token Info */}
        <Animated.View entering={FadeInDown.duration(350).delay(300)} style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Network</Text>
            <Text style={styles.infoValue}>
              {network.charAt(0).toUpperCase() + network.slice(1)}
            </Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Price</Text>
            <View style={styles.infoRight}>
              <Text style={styles.infoValue}>{price}</Text>
              <Text style={[styles.infoChange, positive ? styles.positive : styles.negative]}>
                {change}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Recent Activity */}
        {(MOCK_ACTIVITY[symbol] || []).length > 0 && (
          <Animated.View entering={FadeInDown.duration(350).delay(400)} style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {(MOCK_ACTIVITY[symbol] || []).map((tx, index) => (
              <View key={index} style={styles.txRow}>
                <View style={[
                  styles.txIcon,
                  tx.type === 'receive' && styles.txIconReceive,
                ]}>
                  <Ionicons
                    name={tx.type === 'send' ? 'arrow-up' : 'arrow-down'}
                    size={16}
                    color={tx.type === 'receive' ? '#4ade80' : '#fff'}
                  />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txTitle}>
                    {tx.type === 'send' ? 'Sent' : 'Received'}
                  </Text>
                  <Text style={styles.txAddress}>
                    {tx.type === 'send' ? 'To' : 'From'} {tx.address} · {tx.time}
                  </Text>
                </View>
                <View style={styles.txValues}>
                  <Text style={[
                    styles.txAmount,
                    tx.type === 'receive' && { color: '#4ade80' },
                  ]}>{tx.amount}</Text>
                  <Text style={styles.txValue}>{tx.value}</Text>
                </View>
              </View>
            ))}
          </Animated.View>
        )}
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
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  tokenSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    gap: 8,
  },
  tokenName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginTop: 12,
    letterSpacing: 0.3,
  },
  tokenBalance: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  tokenValue: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
  },
  changeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  positive: {
    color: '#4ade80',
  },
  negative: {
    color: '#f87171',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 36,
    paddingBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.3,
  },
  infoSection: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  infoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoChange: {
    fontSize: 13,
    fontWeight: '700',
  },
  infoDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 12,
  },
  activitySection: {
    marginHorizontal: 20,
    marginBottom: 20,
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
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginBottom: 6,
    gap: 12,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconReceive: {
    backgroundColor: 'rgba(74,222,128,0.1)',
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  txAddress: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.35)',
  },
  txValues: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  txValue: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
});
