import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: March 2024</Text>

        <Text style={styles.sectionTitle}>Our Commitment to Privacy</Text>
        <Text style={styles.paragraph}>
          Aura Wallet is designed with privacy as a core principle. As a self-custody wallet, we never have access to your private keys, recovery phrase, or funds.
        </Text>

        <Text style={styles.sectionTitle}>Data We Don't Collect</Text>
        <Text style={styles.paragraph}>
          We do not collect, store, or have access to:
        </Text>
        <Text style={styles.bulletPoint}>• Your private keys or recovery phrases</Text>
        <Text style={styles.bulletPoint}>• Your wallet balances or transaction history</Text>
        <Text style={styles.bulletPoint}>• Your personal identification information</Text>
        <Text style={styles.bulletPoint}>• Your location data</Text>

        <Text style={styles.sectionTitle}>Data Stored on Your Device</Text>
        <Text style={styles.paragraph}>
          All sensitive data is stored locally on your device and encrypted:
        </Text>
        <Text style={styles.bulletPoint}>• Encrypted private keys</Text>
        <Text style={styles.bulletPoint}>• Wallet addresses</Text>
        <Text style={styles.bulletPoint}>• App preferences and settings</Text>
        <Text style={styles.bulletPoint}>• Transaction history cache</Text>

        <Text style={styles.sectionTitle}>Blockchain Data</Text>
        <Text style={styles.paragraph}>
          When you make transactions, data is recorded on public blockchains. This is inherent to how blockchain technology works and is not controlled by us. Transaction data on blockchains is public and permanent.
        </Text>

        <Text style={styles.sectionTitle}>Third-Party Services</Text>
        <Text style={styles.paragraph}>
          We may use third-party services for:
        </Text>
        <Text style={styles.bulletPoint}>• Fetching token prices and market data</Text>
        <Text style={styles.bulletPoint}>• Broadcasting transactions to networks</Text>
        <Text style={styles.bulletPoint}>• Retrieving blockchain data</Text>
        <Text style={styles.paragraph}>
          These services may have their own privacy policies. We choose partners who respect user privacy.
        </Text>

        <Text style={styles.sectionTitle}>Analytics</Text>
        <Text style={styles.paragraph}>
          We may collect anonymous, aggregated usage statistics to improve the app. This data cannot be used to identify individual users and includes:
        </Text>
        <Text style={styles.bulletPoint}>• App crashes and errors</Text>
        <Text style={styles.bulletPoint}>• Feature usage patterns (anonymized)</Text>
        <Text style={styles.bulletPoint}>• Device type and OS version</Text>

        <Text style={styles.sectionTitle}>Your Rights</Text>
        <Text style={styles.paragraph}>
          Since we don't collect personal data, there's nothing to delete or export. Your wallet data is entirely under your control on your device.
        </Text>

        <Text style={styles.sectionTitle}>Security</Text>
        <Text style={styles.paragraph}>
          We implement industry-standard security measures including:
        </Text>
        <Text style={styles.bulletPoint}>• AES-256 encryption for stored keys</Text>
        <Text style={styles.bulletPoint}>• Secure Enclave/Keystore integration</Text>
        <Text style={styles.bulletPoint}>• Biometric authentication support</Text>
        <Text style={styles.bulletPoint}>• PIN protection</Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          For privacy-related questions, contact us at privacy@aurawallet.app
        </Text>
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 22,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 22,
    marginLeft: 8,
    marginBottom: 4,
  },
});
