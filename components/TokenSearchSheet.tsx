import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
} from 'react-native-reanimated';

import TokenIcon from './TokenIcon';

// Available chains for filtering
const CHAINS = [
  { id: 'all', name: 'All Chains', icon: 'layers-outline' as const },
  { id: 'ethereum', name: 'Ethereum', icon: 'flash-outline' as const },
  { id: 'arbitrum', name: 'Arbitrum', icon: 'git-network-outline' as const },
  { id: 'base', name: 'Base', icon: 'radio-button-on-outline' as const },
  { id: 'bsc', name: 'BNB Chain', icon: 'globe-outline' as const },
];

// All available tokens (held + zero balance)
const ALL_TOKENS = [
  // Held tokens
  { symbol: 'ETH', name: 'Ethereum', network: 'ethereum', balance: '1.4520', value: 3842.16 },
  { symbol: 'USDT', name: 'Tether', network: 'ethereum', balance: '250.00', value: 250.0 },
  { symbol: 'USDC', name: 'USD Coin', network: 'ethereum', balance: '126.47', value: 126.47 },
  { symbol: 'ARB', name: 'Arbitrum', network: 'arbitrum', balance: '45.20', value: 52.0 },
  { symbol: 'LINK', name: 'Chainlink', network: 'ethereum', balance: '3.50', value: 48.0 },
  // Zero balance tokens
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', network: 'ethereum', balance: '0', value: 0 },
  { symbol: 'UNI', name: 'Uniswap', network: 'ethereum', balance: '0', value: 0 },
  { symbol: 'AAVE', name: 'Aave', network: 'ethereum', balance: '0', value: 0 },
  { symbol: 'DAI', name: 'Dai', network: 'ethereum', balance: '0', value: 0 },
  { symbol: 'MKR', name: 'Maker', network: 'ethereum', balance: '0', value: 0 },
  { symbol: 'CRV', name: 'Curve DAO', network: 'ethereum', balance: '0', value: 0 },
  { symbol: 'LDO', name: 'Lido DAO', network: 'ethereum', balance: '0', value: 0 },
  { symbol: 'APE', name: 'ApeCoin', network: 'ethereum', balance: '0', value: 0 },
  { symbol: 'GRT', name: 'The Graph', network: 'ethereum', balance: '0', value: 0 },
  { symbol: 'ENS', name: 'ENS', network: 'ethereum', balance: '0', value: 0 },
  { symbol: 'MATIC', name: 'Polygon', network: 'ethereum', balance: '0', value: 0 },
  { symbol: 'SHIB', name: 'Shiba Inu', network: 'ethereum', balance: '0', value: 0 },
];

interface TokenSearchSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectToken?: (token: typeof ALL_TOKENS[0]) => void;
}

export default function TokenSearchSheet({
  visible,
  onClose,
  onSelectToken,
}: TokenSearchSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState('all');

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
      setSelectedChain('all');
    }
  }, [visible]);

  // Filter and sort tokens
  const filteredTokens = ALL_TOKENS
    .filter(token => {
      // Chain filter
      if (selectedChain !== 'all' && token.network !== selectedChain) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by value (held tokens first, then alphabetically)
      if (a.value > 0 && b.value === 0) return -1;
      if (a.value === 0 && b.value > 0) return 1;
      if (a.value !== b.value) return b.value - a.value;
      return a.symbol.localeCompare(b.symbol);
    });

  const heldTokens = filteredTokens.filter(t => t.value > 0);
  const zeroBalanceTokens = filteredTokens.filter(t => t.value === 0);

  const handleSelectToken = (token: typeof ALL_TOKENS[0]) => {
    onSelectToken?.(token);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View
          entering={SlideInDown.duration(300).springify().damping(20)}
          exiting={SlideOutDown.duration(300)}
          style={styles.sheet}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Token</Text>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color="rgba(255,255,255,0.6)" />
            </Pressable>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.3)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or symbol..."
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
                <Ionicons
                  name={chain.icon}
                  size={14}
                  color={selectedChain === chain.id ? '#fff' : 'rgba(255,255,255,0.5)'}
                />
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
            style={styles.tokenList}
            contentContainerStyle={styles.tokenListContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Held Tokens */}
            {heldTokens.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Your Tokens</Text>
                {heldTokens.map(token => (
                  <Pressable
                    key={`${token.symbol}-${token.network}`}
                    style={styles.tokenRow}
                    onPress={() => handleSelectToken(token)}
                  >
                    <TokenIcon
                      symbol={token.symbol}
                      size={40}
                      showChainBadge={token.network !== 'ethereum'}
                      chain={token.network}
                    />
                    <View style={styles.tokenInfo}>
                      <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                      <Text style={styles.tokenName}>{token.name}</Text>
                    </View>
                    <View style={styles.tokenValues}>
                      <Text style={styles.tokenBalance}>{token.balance}</Text>
                      <Text style={styles.tokenValue}>${token.value.toFixed(2)}</Text>
                    </View>
                  </Pressable>
                ))}
              </>
            )}

            {/* Zero Balance Tokens */}
            {zeroBalanceTokens.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Other Tokens</Text>
                {zeroBalanceTokens.map(token => (
                  <Pressable
                    key={`${token.symbol}-${token.network}`}
                    style={[styles.tokenRow, styles.tokenRowDimmed]}
                    onPress={() => handleSelectToken(token)}
                  >
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
                      <Text style={styles.tokenName}>{token.name}</Text>
                    </View>
                    <Text style={styles.zeroBalance}>$0.00</Text>
                  </Pressable>
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
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  sheet: {
    backgroundColor: '#0a0a0a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
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
  tokenList: {
    flex: 1,
  },
  tokenListContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 8,
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
  tokenValues: {
    alignItems: 'flex-end',
  },
  tokenBalance: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  tokenValue: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  zeroBalance: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.25)',
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
