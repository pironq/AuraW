import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import TokenIcon from '@/components/TokenIcon';

// Mock tokens
const USER_TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', network: 'ethereum', balance: '1.4520', value: '$3,842.16' },
  { symbol: 'USDT', name: 'Tether', network: 'ethereum', balance: '250.00', value: '$250.00' },
  { symbol: 'USDC', name: 'USD Coin', network: 'ethereum', balance: '126.47', value: '$126.47' },
  { symbol: 'ARB', name: 'Arbitrum', network: 'arbitrum', balance: '45.20', value: '$52.00' },
  { symbol: 'LINK', name: 'Chainlink', network: 'ethereum', balance: '3.50', value: '$48.00' },
];

export default function ReceiveScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = searchQuery
    ? USER_TOKENS.filter(t =>
        t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : USER_TOKENS;

  const handleSelectToken = (token: typeof USER_TOKENS[0]) => {
    router.push({
      pathname: '/receive-token',
      params: {
        symbol: token.symbol,
        name: token.name,
        network: token.network,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityLabel="Back"
          accessibilityRole="button"
          accessibilityHint="Goes back to the previous screen"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Receive</Text>
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
            <Pressable
              onPress={() => setSearchQuery('')}
              accessibilityLabel="Clear search"
              accessibilityRole="button"
              accessibilityHint="Clears the current search query"
            >
              <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.3)" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Token List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Select Token to Receive</Text>
        {filteredTokens.map((token, index) => (
          <Animated.View
            key={`${token.symbol}-${token.network}`}
            entering={FadeInDown.delay(index * 50).duration(300)}
          >
            <Pressable
              style={styles.tokenRow}
              onPress={() => handleSelectToken(token)}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`${token.symbol} token ${token.name} on ${token.network}`}
              accessibilityHint="Tap to select this token"
            >
              <TokenIcon
                symbol={token.symbol}
                size={44}
                showChainBadge={token.network !== 'ethereum'}
                chain={token.network}
              />
              <View style={styles.tokenInfo}>
                <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                <Text style={styles.tokenName}>{token.name}</Text>
              </View>
              <View style={styles.networkBadge}>
                <Text style={styles.networkText}>
                  {token.network.charAt(0).toUpperCase() + token.network.slice(1)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.2)" />
            </Pressable>
          </Animated.View>
        ))}

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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 12,
    marginLeft: 4,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 8,
    gap: 12,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  tokenName: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  networkBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginRight: 4,
  },
  networkText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.3)',
  },
});
