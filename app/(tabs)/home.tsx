import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    Easing,
    FadeIn,
    FadeInDown,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

import TokenIcon from '@/components/TokenIcon';
import TokenSearchSheet from '@/components/TokenSearchSheet';

// Mock wallets
const MOCK_WALLETS = [
  {
    id: '1',
    name: 'Main Wallet',
    address: '0x1a2B...9cDe',
    fullAddress: '0x1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9cDe',
  },
  {
    id: '2',
    name: 'Trading',
    address: '0x3f4A...7bCc',
    fullAddress: '0x3f4A5b6C7d8E9f0A1b2C3d4E5f6A7b8C9d0E7bCc',
  },
  {
    id: '3',
    name: 'Savings',
    address: '0x8d1E...2fAa',
    fullAddress: '0x8d1E2f3A4b5C6d7E8f9A0b1C2d3E4f5A6b7C2fAa',
  },
];

const TOKENS_MAIN = [
  { symbol: 'ETH', name: 'Ethereum', network: 'ethereum', balance: '1.4520', value: '$3,842.16', price: '$2,645.80', change: '+2.8%', positive: true },
  { symbol: 'USDT', name: 'Tether', network: 'ethereum', balance: '250.00', value: '$250.00', price: '$1.00', change: '+0.01%', positive: true },
  { symbol: 'USDC', name: 'USD Coin', network: 'ethereum', balance: '126.47', value: '$126.47', price: '$1.00', change: '+0.02%', positive: true },
  { symbol: 'ARB', name: 'Arbitrum', network: 'arbitrum', balance: '45.20', value: '$52.00', price: '$1.15', change: '-1.2%', positive: false },
  { symbol: 'LINK', name: 'Chainlink', network: 'ethereum', balance: '3.50', value: '$48.00', price: '$13.71', change: '+4.1%', positive: true },
];

const TOKENS_TRADING = [
  { symbol: 'ETH', name: 'Ethereum', network: 'ethereum', balance: '0.2200', value: '$582.08', price: '$2,645.80', change: '+2.8%', positive: true },
  { symbol: 'ARB', name: 'Arbitrum', network: 'arbitrum', balance: '180.00', value: '$207.00', price: '$1.15', change: '-1.2%', positive: false },
  { symbol: 'USDC', name: 'USD Coin', network: 'ethereum', balance: '103.02', value: '$103.02', price: '$1.00', change: '+0.02%', positive: true },
];

const TOKENS_SAVINGS = [
  { symbol: 'ETH', name: 'Ethereum', network: 'ethereum', balance: '4.2000', value: '$11,112.36', price: '$2,645.80', change: '+2.8%', positive: true },
  { symbol: 'LINK', name: 'Chainlink', network: 'ethereum', balance: '90.00', value: '$1,233.90', price: '$13.71', change: '+4.1%', positive: true },
  { symbol: 'USDT', name: 'Tether', network: 'ethereum', balance: '103.74', value: '$103.74', price: '$1.00', change: '+0.01%', positive: true },
];

const ACTIVITY_MAIN = [
  { type: 'send', token: 'ETH', amount: '-0.05 ETH', value: '$132.29', to: '0x8f2...4aB', time: '2h ago' },
  { type: 'receive', token: 'USDT', amount: '+250 USDT', value: '$250.00', to: '0x1a2...9cD', time: '5h ago' },
  { type: 'swap', token: 'ETH → USDC', amount: '0.1 ETH', value: '$264.58', to: '', time: '1d ago' },
  { type: 'receive', token: 'ETH', amount: '+0.5 ETH', value: '$1,322.90', to: '0x1a2...9cD', time: '3d ago' },
];

const ACTIVITY_TRADING = [
  { type: 'send', token: 'ARB', amount: '-50 ARB', value: '$57.50', to: '0x9a1...6cD', time: '1h ago' },
  { type: 'receive', token: 'USDC', amount: '+75 USDC', value: '$75.00', to: '0x3f4...7bC', time: '7h ago' },
];

const ACTIVITY_SAVINGS = [
  { type: 'receive', token: 'ETH', amount: '+1.2 ETH', value: '$3,174.96', to: '0x8d1...2fA', time: '4d ago' },
  { type: 'receive', token: 'LINK', amount: '+25 LINK', value: '$342.75', to: '0x8d1...2fA', time: '1w ago' },
];

const STORAGE_KEY = 'auraw:manage-tokens';

const ACTION_BUTTONS = [
  { label: 'Send', icon: 'arrow-up-outline' as const },
  { label: 'Receive', icon: 'arrow-down-outline' as const },
  { label: 'Swap', icon: 'swap-horizontal-outline' as const },
  { label: 'Buy', icon: 'add-outline' as const },
];

const ACTIVITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  send: 'arrow-up',
  receive: 'arrow-down',
  swap: 'swap-horizontal',
};

export default function HomeScreen() {
  const [activeWallet, setActiveWallet] = useState(MOCK_WALLETS[0]);
  const [walletDropdown, setWalletDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'crypto' | 'activity'>('crypto');
  const [searchSheetVisible, setSearchSheetVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [comingSoonModal, setComingSoonModal] = useState<string | null>(null);
  const [enabledSymbols, setEnabledSymbols] = useState<Set<string> | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadEnabledSymbols = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setEnabledSymbols(null);
        return;
      }
      const parsed = JSON.parse(stored) as Array<{ symbol: string; enabled: boolean }>;
      const enabled = new Set(
        parsed.filter((t) => t.enabled).map((t) => t.symbol.toUpperCase())
      );
      setEnabledSymbols(enabled);
    } catch (error) {
      console.warn('Failed to load enabled token symbols:', error);
      setEnabledSymbols(null);
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEnabledSymbols();
    }, [loadEnabledSymbols])
  );

  // Copy address handler
  const handleCopyAddress = async () => {
    await Clipboard.setStringAsync(activeWallet.fullAddress);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // Action button handler
  const handleActionPress = (action: string) => {
    switch (action) {
      case 'Send':
        router.push('/send');
        break;
      case 'Receive':
        router.push('/receive');
        break;
      case 'Swap':
      case 'Buy':
        setComingSoonModal(action);
        break;
    }
  };

  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(16);
  const listOpacity = useSharedValue(0);

  useEffect(() => {
    cardOpacity.value = withDelay(
      150,
      withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) })
    );
    cardTranslateY.value = withDelay(
      150,
      withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) })
    );
    listOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const listStyle = useAnimatedStyle(() => ({
    opacity: listOpacity.value,
  }));

  const walletData = useMemo(() => {
    if (activeWallet.id === '2') {
      return {
        totalBalance: '$892.10',
        balanceChange: '+$24.50 (2.8%)',
        tokens: TOKENS_TRADING,
        activity: ACTIVITY_TRADING,
      };
    }
    if (activeWallet.id === '3') {
      return {
        totalBalance: '$12,450.00',
        balanceChange: '+$340.20 (2.8%)',
        tokens: TOKENS_SAVINGS,
        activity: ACTIVITY_SAVINGS,
      };
    }
    return {
      totalBalance: '$4,218.63',
      balanceChange: '+$127.40 (3.1%)',
      tokens: TOKENS_MAIN,
      activity: ACTIVITY_MAIN,
    };
  }, [activeWallet.id]);

  const visibleTokens = useMemo(() => {
    if (!enabledSymbols) return walletData.tokens;
    return walletData.tokens.filter((token) => enabledSymbols.has(token.symbol.toUpperCase()));
  }, [enabledSymbols, walletData.tokens]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Wallet selector (left) */}
          <Pressable
            style={styles.walletSelector}
            onPress={() => setWalletDropdown(true)}
          >
            <View style={styles.walletDot} />
            <Text style={styles.walletName} numberOfLines={1}>{activeWallet.name}</Text>
            <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.4)" />
          </Pressable>

          {/* Right side icons */}
          <View style={styles.headerRight}>
            <Pressable
              style={styles.headerIcon}
              onPress={() => setSearchSheetVisible(true)}
            >
              <Ionicons name="search-outline" size={19} color="rgba(255,255,255,0.6)" />
            </Pressable>
            <Pressable style={styles.headerIcon} onPress={() => router.push('/qr-scanner')}>
              <Ionicons name="scan-outline" size={19} color="rgba(255,255,255,0.6)" />
            </Pressable>
          </View>
        </View>

        {/* Balance Card */}
        <Animated.View style={[styles.balanceCard, cardStyle]}>
          <View style={styles.addressRow}>
            <Text style={styles.addressText}>{activeWallet.address}</Text>
            <Pressable style={styles.copyBtn} onPress={handleCopyAddress}>
              {copied ? (
                <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)}>
                  <Ionicons name="checkmark" size={13} color="#4ade80" />
                </Animated.View>
              ) : (
                <Ionicons name="copy-outline" size={13} color="rgba(255,255,255,0.35)" />
              )}
            </Pressable>
            {copied && (
              <Animated.Text
                entering={FadeIn.duration(150)}
                exiting={FadeOut.duration(150)}
                style={styles.copiedText}
              >
                Copied!
              </Animated.Text>
            )}
          </View>

          <View style={styles.balanceSection}>
            <Text style={styles.balanceAmount}>{walletData.totalBalance}</Text>
            <View style={styles.changeRow}>
              <Ionicons name="caret-up" size={12} color="#4ade80" />
              <Text style={styles.balanceChange}>{walletData.balanceChange}</Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            {ACTION_BUTTONS.map((action, i) => (
              <Pressable
                key={i}
                style={styles.actionButton}
                onPress={() => handleActionPress(action.label)}
              >
                <View style={styles.actionCircle}>
                  <Ionicons name={action.icon} size={20} color="#fff" />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Tabs: Crypto / Activity */}
        <Animated.View style={listStyle}>
          <View style={styles.tabRow}>
            <Pressable
              onPress={() => setActiveTab('crypto')}
              style={[styles.tab, activeTab === 'crypto' && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === 'crypto' && styles.tabTextActive]}>
                Crypto
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('activity')}
              style={[styles.tab, activeTab === 'activity' && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === 'activity' && styles.tabTextActive]}>
                Activity
              </Text>
            </Pressable>
            <View style={styles.tabSpacer} />
            <Pressable
              style={styles.manageBtn}
              onPress={() => router.push('/manage-tokens')}
            >
              <Ionicons name="options-outline" size={16} color="rgba(255,255,255,0.5)" />
              <Text style={styles.manageBtnText}>Manage</Text>
            </Pressable>
          </View>

          {/* Token list */}
          {activeTab === 'crypto' && (
            <View style={styles.listContainer}>
              {visibleTokens.map((token, index) => (
                <Animated.View
                  key={token.symbol}
                  entering={FadeInDown.delay(500 + index * 60).duration(350)}
                >
                  <Pressable style={styles.tokenRow} onPress={() => router.push({
                    pathname: '/token-detail',
                    params: {
                      symbol: token.symbol,
                      name: token.name,
                      balance: token.balance,
                      value: token.value,
                      price: token.price,
                      change: token.change,
                      positive: String(token.positive),
                      network: token.network,
                      address: activeWallet.fullAddress,
                    },
                  })}>
                    <View style={styles.tokenIconWrap}>
                      <TokenIcon
                        symbol={token.symbol}
                        size={40}
                        showChainBadge={token.network !== 'ethereum'}
                        chain={token.network}
                      />
                    </View>
                    <View style={styles.tokenInfo}>
                      <View style={styles.tokenNameRow}>
                        <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                        <View style={styles.networkBadge}>
                          <Text style={styles.networkText}>
                            {token.network.charAt(0).toUpperCase() + token.network.slice(1)}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.tokenPrice}>
                        {token.price}{' '}
                        <Text style={[styles.tokenChange, token.positive ? styles.positive : styles.negative]}>
                          {token.change}
                        </Text>
                      </Text>
                    </View>
                    <View style={styles.tokenValues}>
                      <Text style={styles.tokenBalance}>{token.balance}</Text>
                      <Text style={styles.tokenValue}>{token.value}</Text>
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          )}

          {/* Activity list */}
          {activeTab === 'activity' && (
            <View style={styles.listContainer}>
              {walletData.activity.map((tx, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInDown.delay(500 + index * 60).duration(350)}
                >
                  <Pressable style={styles.activityRow}>
                    <View style={[
                      styles.activityIcon,
                      tx.type === 'receive' && styles.activityIconReceive,
                      tx.type === 'swap' && styles.activityIconSwap,
                    ]}>
                      <Ionicons
                        name={ACTIVITY_ICONS[tx.type] || 'ellipse-outline'}
                        size={18}
                        color={tx.type === 'receive' ? '#4ade80' : tx.type === 'send' ? '#fff' : '#60a5fa'}
                      />
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle}>
                        {tx.type === 'send' ? 'Sent' : tx.type === 'receive' ? 'Received' : 'Swapped'} {tx.token}
                      </Text>
                      <Text style={styles.activityTime}>
                        {tx.to ? `${tx.type === 'send' ? 'To' : 'From'} ${tx.to} · ` : ''}{tx.time}
                      </Text>
                    </View>
                    <View style={styles.activityValues}>
                      <Text style={[
                        styles.activityAmount,
                        tx.type === 'receive' && { color: '#4ade80' },
                      ]}>{tx.amount}</Text>
                      <Text style={styles.activityValue}>{tx.value}</Text>
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Wallet selector modal */}
      <Modal
        visible={walletDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setWalletDropdown(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setWalletDropdown(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Wallets</Text>

            {MOCK_WALLETS.map(wallet => (
              <Pressable
                key={wallet.id}
                style={[
                  styles.walletOption,
                  wallet.id === activeWallet.id && styles.walletOptionActive,
                ]}
                onPress={() => {
                    setActiveWallet(wallet);
                    setWalletDropdown(false);
                  }}
              >
                <View style={styles.walletOptionLeft}>
                  <View style={[
                    styles.walletOptionDot,
                    wallet.id === activeWallet.id && styles.walletOptionDotActive,
                  ]} />
                  <View>
                    <Text style={styles.walletOptionName}>{wallet.name}</Text>
                    <Text style={styles.walletOptionAddress}>{wallet.address}</Text>
                  </View>
                </View>
                <Text style={styles.walletOptionBalance}>
                  {wallet.id === '2' ? '$892.10' : wallet.id === '3' ? '$12,450.00' : '$4,218.63'}
                </Text>
              </Pressable>
            ))}

            <Pressable
              style={styles.addWalletButton}
              onPress={() => {
                setWalletDropdown(false);
                router.push('/add-wallet');
              }}
            >
              <Ionicons name="add" size={18} color="rgba(255,255,255,0.5)" />
              <Text style={styles.addWalletText}>Add Wallet</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Coming Soon Modal */}
      <Modal
        visible={comingSoonModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setComingSoonModal(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setComingSoonModal(null)}>
          <View style={styles.comingSoonContent}>
            <View style={styles.comingSoonIcon}>
              <Ionicons
                name={comingSoonModal === 'Buy' ? 'card-outline' : 'swap-horizontal'}
                size={32}
                color="rgba(255,255,255,0.6)"
              />
            </View>
            <Text style={styles.comingSoonTitle}>{comingSoonModal}</Text>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
            <Text style={styles.comingSoonSubtext}>
              {comingSoonModal === 'Buy'
                ? 'Buy crypto with card or bank transfer'
                : 'Swap tokens across chains instantly'}
            </Text>
            <Pressable
              style={styles.comingSoonButton}
              onPress={() => setComingSoonModal(null)}
            >
              <Text style={styles.comingSoonButtonText}>Got it</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Token Search Sheet */}
      <TokenSearchSheet
        visible={searchSheetVisible}
        onClose={() => setSearchSheetVisible(false)}
        onSelectToken={(token) => {
          const rawValue = token.value;
          const numericValue = typeof rawValue === 'number'
            ? rawValue
            : Number(String(rawValue).replace(/[$,\s]/g, ''));
          const normalizedValue = Number.isFinite(numericValue) ? numericValue : 0;

          // Navigate to send flow with selected token
          router.push({
            pathname: '/send-amount',
            params: {
              symbol: token.symbol,
              name: token.name,
              network: token.network,
              balance: token.balance,
              value: `$${normalizedValue.toFixed(2)}`,
            },
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 58,
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  walletSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 7,
    maxWidth: 180,
  },
  walletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },
  walletName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Balance Card
  balanceCard: {
    marginHorizontal: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingTop: 18,
    paddingBottom: 24,
    paddingHorizontal: 22,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  addressText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
  },
  copyBtn: {
    padding: 4,
  },
  copiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4ade80',
    marginLeft: 4,
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 26,
  },
  balanceAmount: {
    fontSize: 44,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1.5,
    marginBottom: 4,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  balanceChange: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4ade80',
    letterSpacing: 0.2,
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.2,
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    marginTop: 26,
    marginHorizontal: 18,
    marginBottom: 14,
    gap: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 0.2,
  },
  tabTextActive: {
    color: '#fff',
  },
  tabSpacer: {
    flex: 1,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  manageBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },

  // Token list
  listContainer: {
    paddingHorizontal: 14,
    gap: 6,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  tokenIconWrap: {
    marginRight: 12,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tokenSymbol: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  networkBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  networkText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 0.3,
  },
  tokenPrice: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.35)',
  },
  tokenChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  positive: {
    color: '#4ade80',
  },
  negative: {
    color: '#f87171',
  },
  tokenValues: {
    alignItems: 'flex-end',
  },
  tokenBalance: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  tokenValue: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.35)',
  },

  // Activity
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityIconReceive: {
    backgroundColor: 'rgba(74,222,128,0.1)',
  },
  activityIconSwap: {
    backgroundColor: 'rgba(96,165,250,0.1)',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.3)',
  },
  activityValues: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 3,
  },
  activityValue: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.35)',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 0,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
    marginBottom: 20,
    textAlign: 'center',
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  walletOptionActive: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  walletOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  walletOptionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  walletOptionDotActive: {
    backgroundColor: '#4ade80',
  },
  walletOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  walletOptionAddress: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.35)',
  },
  walletOptionBalance: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  addWalletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderStyle: 'dashed',
  },
  addWalletText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
  },

  // Coming Soon Modal
  comingSoonContent: {
    backgroundColor: '#111',
    borderRadius: 24,
    marginHorizontal: 32,
    marginBottom: 'auto',
    marginTop: 'auto',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  comingSoonIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  comingSoonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
  },
  comingSoonSubtext: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  comingSoonButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  comingSoonButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});
