import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

// Token contract addresses on Ethereum mainnet (for CDN URLs)
const TOKEN_ADDRESSES: Record<string, string> = {
  ETH: 'native',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  ARB: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  DAI: '0x6B175474E89094C44Da98b954EedeCC490De4437',
  WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  AAVE: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
  SHIB: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
  LDO: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
  MKR: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
  CRV: '0xD533a949740bb3306d119CC777fa900bA034cd52',
  APE: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
  SAND: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
  MANA: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
  GRT: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
  ENS: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
};

// Chain logo URLs
const CHAIN_LOGOS: Record<string, string> = {
  ethereum: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  arbitrum: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png',
  base: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png',
  polygon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
  bsc: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png',
  optimism: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png',
  avalanche: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png',
};

function getTokenImageUrl(symbol: string): string {
  const address = TOKEN_ADDRESSES[symbol.toUpperCase()];

  if (!address) {
    // Fallback to a placeholder
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png';
  }

  if (address === 'native') {
    // Native ETH
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png';
  }

  // ERC-20 token on Ethereum
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
}

interface TokenIconProps {
  symbol: string;
  size?: number;
  showChainBadge?: boolean;
  chain?: string;
}

export default function TokenIcon({
  symbol,
  size = 44,
  showChainBadge = false,
  chain = 'ethereum'
}: TokenIconProps) {
  const imageUrl = getTokenImageUrl(symbol);
  const normalizedChain = chain.toLowerCase();
  const chainLogoUrl = CHAIN_LOGOS[normalizedChain] || CHAIN_LOGOS.ethereum;
  const badgeSize = size * 0.4;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={{ uri: imageUrl }}
        style={[styles.tokenImage, { width: size, height: size, borderRadius: size / 2 }]}
        resizeMode="cover"
      />
      {showChainBadge && normalizedChain !== 'ethereum' && (
        <View style={[styles.chainBadge, {
          width: badgeSize,
          height: badgeSize,
          borderRadius: badgeSize / 2,
          right: -2,
          bottom: -2,
        }]}>
          <Image
            source={{ uri: chainLogoUrl }}
            style={{ width: badgeSize - 4, height: badgeSize - 4, borderRadius: (badgeSize - 4) / 2 }}
            resizeMode="cover"
          />
        </View>
      )}
    </View>
  );
}

// Export for use in other components
export { CHAIN_LOGOS, getTokenImageUrl, TOKEN_ADDRESSES };

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tokenImage: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  chainBadge: {
    position: 'absolute',
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
