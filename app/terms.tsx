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

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: March 2024</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using Aura Wallet, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
        </Text>

        <Text style={styles.sectionTitle}>2. Self-Custody Wallet</Text>
        <Text style={styles.paragraph}>
          Aura Wallet is a self-custody cryptocurrency wallet. This means you are solely responsible for:
        </Text>
        <Text style={styles.bulletPoint}>• Securing your recovery phrase and private keys</Text>
        <Text style={styles.bulletPoint}>• Maintaining access to your wallet</Text>
        <Text style={styles.bulletPoint}>• All transactions made from your wallet</Text>

        <Text style={styles.sectionTitle}>3. No Recovery Service</Text>
        <Text style={styles.paragraph}>
          We do not store your private keys or recovery phrase. If you lose access to your wallet credentials, we cannot help you recover your funds. This is fundamental to how self-custody wallets work.
        </Text>

        <Text style={styles.sectionTitle}>4. Risk Acknowledgment</Text>
        <Text style={styles.paragraph}>
          Cryptocurrency transactions are irreversible. You acknowledge the risks involved in using cryptocurrency and blockchain technology, including but not limited to:
        </Text>
        <Text style={styles.bulletPoint}>• Price volatility and potential loss of value</Text>
        <Text style={styles.bulletPoint}>• Transaction errors and irreversible transfers</Text>
        <Text style={styles.bulletPoint}>• Smart contract vulnerabilities</Text>
        <Text style={styles.bulletPoint}>• Regulatory changes</Text>

        <Text style={styles.sectionTitle}>5. Prohibited Activities</Text>
        <Text style={styles.paragraph}>
          You agree not to use Aura Wallet for any illegal activities, money laundering, terrorist financing, or other prohibited purposes under applicable law.
        </Text>

        <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          To the maximum extent permitted by law, Aura Wallet and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the application.
        </Text>

        <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these terms at any time. Continued use of the application after changes constitutes acceptance of the new terms.
        </Text>

        <Text style={styles.sectionTitle}>8. Contact</Text>
        <Text style={styles.paragraph}>
          For questions about these terms, please contact us at support@aurawallet.app
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
