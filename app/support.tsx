import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type SupportOption = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
  action: () => Promise<void>;
};

export default function SupportScreen() {
  const openSupportLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert('Cannot open link', `This device cannot open: ${url}`);
        return;
      }
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Failed to open link', `URL: ${url}`);
      console.warn('Support link open failed:', error);
    }
  };

  const supportOptions: SupportOption[] = [
    {
      icon: 'book-outline',
      title: 'Help Center',
      desc: 'Browse FAQs and guides',
      action: async () => openSupportLink('https://help.aurawallet.app'),
    },
    {
      icon: 'chatbubble-outline',
      title: 'Contact Support',
      desc: 'Get help from our team',
      action: async () => openSupportLink('mailto:support@aurawallet.app'),
    },
    {
      icon: 'logo-twitter',
      title: 'Twitter',
      desc: 'Follow us for updates',
      action: async () => openSupportLink('https://twitter.com/aurawallet'),
    },
    {
      icon: 'logo-discord',
      title: 'Discord Community',
      desc: 'Join the community',
      action: async () => openSupportLink('https://discord.gg/aurawallet'),
    },
  ];

  const faqs = [
    {
      q: 'How do I backup my wallet?',
      a: 'Go to Settings > View Recovery Phrase. Write down your 12-word phrase and store it securely offline.',
    },
    {
      q: 'Can I recover my wallet if I lose my phone?',
      a: 'Yes, if you have your recovery phrase. Download Aura Wallet on a new device and import your wallet using the phrase.',
    },
    {
      q: 'Are my funds safe?',
      a: 'Your private keys are encrypted and stored only on your device. We never have access to your funds.',
    },
    {
      q: 'What networks are supported?',
      a: 'Aura Wallet supports Ethereum, Arbitrum, Base, BNB Chain, Polygon, Optimism, and Avalanche.',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Support Options */}
        <Text style={styles.sectionTitle}>Get Help</Text>
        <View style={styles.optionsGrid}>
          {supportOptions.map((option, index) => (
            <Animated.View
              key={option.title}
              entering={FadeInDown.delay(index * 50).duration(250)}
              style={styles.optionCard}
            >
              <Pressable style={styles.optionContent} onPress={option.action}>
                <View style={styles.optionIcon}>
                  <Ionicons name={option.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDesc}>{option.desc}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(200 + index * 50).duration(250)}
            style={styles.faqCard}
          >
            <Text style={styles.faqQuestion}>{faq.q}</Text>
            <Text style={styles.faqAnswer}>{faq.a}</Text>
          </Animated.View>
        ))}
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
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 12,
    marginLeft: 4,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    width: '47%',
  },
  optionContent: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  optionDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
  faqCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 20,
  },
});
