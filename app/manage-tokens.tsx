import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TokenIcon from '@/components/TokenIcon';

// Available chains
const CHAINS = [
  { id: 'all', name: 'All' },
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'arbitrum', name: 'Arbitrum' },
  { id: 'base', name: 'Base' },
  { id: 'bsc', name: 'BNB Chain' },
];

// All tokens with enabled state
const ALL_TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', network: 'ethereum', enabled: true },
  { symbol: 'USDT', name: 'Tether', network: 'ethereum', enabled: true },
  { symbol: 'USDC', name: 'USD Coin', network: 'ethereum', enabled: true },
  { symbol: 'ARB', name: 'Arbitrum', network: 'arbitrum', enabled: true },
  { symbol: 'LINK', name: 'Chainlink', network: 'ethereum', enabled: true },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', network: 'ethereum', enabled: false },
  { symbol: 'UNI', name: 'Uniswap', network: 'ethereum', enabled: false },
  { symbol: 'AAVE', name: 'Aave', network: 'ethereum', enabled: false },
  { symbol: 'DAI', name: 'Dai', network: 'ethereum', enabled: false },
  { symbol: 'MKR', name: 'Maker', network: 'ethereum', enabled: false },
  { symbol: 'CRV', name: 'Curve DAO', network: 'ethereum', enabled: false },
  { symbol: 'LDO', name: 'Lido DAO', network: 'ethereum', enabled: false },
  { symbol: 'APE', name: 'ApeCoin', network: 'ethereum', enabled: false },
  { symbol: 'GRT', name: 'The Graph', network: 'ethereum', enabled: false },
  { symbol: 'ENS', name: 'ENS', network: 'ethereum', enabled: false },
  { symbol: 'MATIC', name: 'Polygon', network: 'ethereum', enabled: false },
  { symbol: 'SHIB', name: 'Shiba Inu', network: 'ethereum', enabled: false },
];

const STORAGE_KEY = 'auraw:manage-tokens';

export default function ManageTokensScreen() {
  const insets = useSafeAreaInsets();
  const [tokens, setTokens] = useState(ALL_TOKENS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState('all');

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) return;
        const parsed = JSON.parse(stored) as typeof ALL_TOKENS;
        setTokens(parsed);
      } catch (error) {
        console.warn('Failed to load managed tokens:', error);
        setTokens(ALL_TOKENS);
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    };
    loadTokens();
  }, []);

  const toggleToken = async (symbol: string) => {
    const prevTokens = tokens;
    const nextTokens = tokens.map((t) =>
      t.symbol === symbol ? { ...t, enabled: !t.enabled } : t
    );
    setTokens(nextTokens);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextTokens));
    } catch (error) {
      setTokens(prevTokens);
      console.warn('Failed to persist managed tokens:', error);
      Alert.alert('Update failed', 'Could not save token visibility. Please try again.');
    }
  };

  // Filter tokens
  const filteredTokens = tokens.filter(token => {
    if (selectedChain !== 'all' && token.network !== selectedChain) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const enabledTokens = filteredTokens.filter(t => t.enabled);
  const disabledTokens = filteredTokens.filter(t => !t.enabled);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Manage Tokens</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.3)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tokens..."
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.3)" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Chain Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chainScroll}
        contentContainerStyle={styles.chainScrollContent}
      >
        {CHAINS.map(chain => (
          <Pressable
            key={chain.id}
            style={[
              styles.chainChip,
              selectedChain === chain.id && styles.chainChipActive,
            ]}
            onPress={() => setSelectedChain(chain.id)}
          >
            <Text
              style={[
                styles.chainChipText,
                selectedChain === chain.id && styles.chainChipTextActive,
              ]}
            >
              {chain.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Token List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Enabled Tokens */}
        {enabledTokens.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Visible ({enabledTokens.length})
            </Text>
            {enabledTokens.map((token, index) => (
              <Animated.View
                key={token.symbol}
                entering={FadeInDown.delay(index * 30).duration(250)}
              >
                <View style={styles.tokenRow}>
                  <TokenIcon
                    symbol={token.symbol}
                    size={40}
                    showChainBadge={token.network !== 'ethereum'}
                    chain={token.network}
                  />
                  <View style={styles.tokenInfo}>
                    <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                    <Text style={styles.tokenName}>
                      {token.name} · {token.network.charAt(0).toUpperCase() + token.network.slice(1)}
                    </Text>
                  </View>
                  <Switch
                    value={token.enabled}
                    onValueChange={() => toggleToken(token.symbol)}
                    trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(74,222,128,0.3)' }}
                    thumbColor={token.enabled ? '#4ade80' : 'rgba(255,255,255,0.5)'}
                  />
                </View>
              </Animated.View>
            ))}
          </>
        )}

        {/* Disabled Tokens */}
        {disabledTokens.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Hidden ({disabledTokens.length})
            </Text>
            {disabledTokens.map((token, index) => (
              <Animated.View
                key={token.symbol}
                entering={FadeInDown.delay((enabledTokens.length + index) * 30).duration(250)}
              >
                <View style={[styles.tokenRow, styles.tokenRowDimmed]}>
                  <TokenIcon
                    symbol={token.symbol}
                    size={40}
                    showChainBadge={token.network !== 'ethereum'}
                    chain={token.network}
                  />
                  <View style={styles.tokenInfo}>
                    <Text style={[styles.tokenSymbol, styles.tokenSymbolDimmed]}>
                      {token.symbol}
                    </Text>
                    <Text style={styles.tokenName}>
                      {token.name} · {token.network.charAt(0).toUpperCase() + token.network.slice(1)}
                    </Text>
                  </View>
                  <Switch
                    value={token.enabled}
                    onValueChange={() => toggleToken(token.symbol)}
                    trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(74,222,128,0.3)' }}
                    thumbColor={token.enabled ? '#4ade80' : 'rgba(255,255,255,0.5)'}
                  />
                </View>
              </Animated.View>
            ))}
          </>
        )}

        {/* Empty State */}
        {filteredTokens.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.15)" />
            <Text style={styles.emptyText}>No tokens found</Text>
          </View>
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
    padding: 0,
  },
  chainScroll: {
    maxHeight: 44,
    marginBottom: 8,
  },
  chainScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chainChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  chainChipActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  chainChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  chainChipTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 10,
    marginLeft: 4,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginBottom: 6,
    gap: 12,
  },
  tokenRowDimmed: {
    opacity: 0.6,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenSymbol: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  tokenSymbolDimmed: {
    color: 'rgba(255,255,255,0.7)',
  },
  tokenName: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.3)',
  },
});
