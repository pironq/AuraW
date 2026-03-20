import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import AuraLogo from '@/components/AuraLogo';

type SettingItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  type: 'link' | 'toggle' | 'value';
  value?: string | boolean;
  danger?: boolean;
  onPress?: () => void;
};

type SettingSection = {
  title: string;
  items: SettingItem[];
};

export default function SettingsScreen() {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSecurityOption = (option: string) => {
    router.push({
      pathname: '/security-verify',
      params: { action: option },
    });
  };

  const sections: SettingSection[] = [
    {
      title: 'Security',
      items: [
        {
          id: 'recovery-phrase',
          icon: 'key-outline',
          title: 'View Recovery Phrase',
          subtitle: 'Back up your 12-word phrase',
          type: 'link',
          onPress: () => handleSecurityOption('recovery-phrase'),
        },
        {
          id: 'private-key',
          icon: 'lock-closed-outline',
          title: 'Export Private Key',
          subtitle: 'View and export your private key',
          type: 'link',
          onPress: () => handleSecurityOption('private-key'),
        },
        {
          id: 'biometric',
          icon: 'finger-print-outline',
          title: 'Biometric Authentication',
          subtitle: 'Use Face ID or fingerprint',
          type: 'toggle',
          value: biometricEnabled,
          onPress: () => setBiometricEnabled(!biometricEnabled),
        },
        {
          id: 'change-pin',
          icon: 'keypad-outline',
          title: 'Change PIN',
          subtitle: 'Update your security PIN',
          type: 'link',
          onPress: () => handleSecurityOption('change-pin'),
        },
      ],
    },
    {
      title: 'Backup',
      items: [
        {
          id: 'cloud-backup',
          icon: 'cloud-upload-outline',
          title: 'Backup to Cloud',
          subtitle: 'Encrypted backup to iCloud/Google Drive',
          type: 'link',
          onPress: () => router.push('/backup-cloud'),
        },
        {
          id: 'export-wallet',
          icon: 'document-text-outline',
          title: 'Export Wallet',
          subtitle: 'Export encrypted wallet file',
          type: 'link',
          onPress: () => handleSecurityOption('export-wallet'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'currency',
          icon: 'cash-outline',
          title: 'Local Currency',
          type: 'value',
          value: 'USD',
          onPress: () => router.push('/settings-currency'),
        },
        {
          id: 'network',
          icon: 'globe-outline',
          title: 'Default Network',
          type: 'value',
          value: 'Ethereum',
          onPress: () => router.push('/settings-network'),
        },
        {
          id: 'notifications',
          icon: 'notifications-outline',
          title: 'Push Notifications',
          subtitle: 'Transaction alerts and updates',
          type: 'toggle',
          value: notificationsEnabled,
          onPress: () => setNotificationsEnabled(!notificationsEnabled),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          id: 'terms',
          icon: 'document-outline',
          title: 'Terms of Service',
          type: 'link',
          onPress: () => router.push('/terms'),
        },
        {
          id: 'privacy',
          icon: 'shield-outline',
          title: 'Privacy Policy',
          type: 'link',
          onPress: () => router.push('/privacy'),
        },
        {
          id: 'support',
          icon: 'help-circle-outline',
          title: 'Help & Support',
          type: 'link',
          onPress: () => router.push('/support'),
        },
        {
          id: 'version',
          icon: 'information-circle-outline',
          title: 'App Version',
          type: 'value',
          value: '1.0.0',
        },
      ],
    },
    {
      title: 'Danger Zone',
      items: [
        {
          id: 'reset-wallet',
          icon: 'trash-outline',
          title: 'Reset Wallet',
          subtitle: 'Remove all data from this device',
          type: 'link',
          danger: true,
          onPress: () => router.push('/reset-wallet'),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <AuraLogo size={32} isDark />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section, sectionIndex) => (
          <Animated.View
            key={section.title}
            entering={FadeInDown.delay(sectionIndex * 100).duration(300)}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <Pressable
                  key={item.id}
                  style={[
                    styles.settingRow,
                    itemIndex < section.items.length - 1 && styles.settingRowBorder,
                  ]}
                  onPress={item.onPress}
                  disabled={!item.onPress && item.type !== 'toggle'}
                >
                  <View style={[styles.iconWrap, item.danger && styles.iconWrapDanger]}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={item.danger ? '#f87171' : 'rgba(255,255,255,0.7)'}
                    />
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, item.danger && styles.settingTitleDanger]}>
                      {item.title}
                    </Text>
                    {item.subtitle && (
                      <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>
                  {item.type === 'link' && (
                    <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.2)" />
                  )}
                  {item.type === 'value' && (
                    <View style={styles.valueRow}>
                      <Text style={styles.valueText}>{item.value}</Text>
                      {item.onPress && (
                        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.2)" />
                      )}
                    </View>
                  )}
                  {item.type === 'toggle' && (
                    <Switch
                      value={item.value as boolean}
                      onValueChange={item.onPress}
                      trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(74,222,128,0.3)' }}
                      thumbColor={item.value ? '#4ade80' : 'rgba(255,255,255,0.5)'}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <AuraLogo size={24} isDark />
          <Text style={styles.footerText}>Aura Wallet</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
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
    paddingTop: 58,
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
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
    marginTop: 24,
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDanger: {
    backgroundColor: 'rgba(248,113,113,0.1)',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  settingTitleDanger: {
    color: '#f87171',
  },
  settingSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.35)',
    marginTop: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.3)',
  },
  footerVersion: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.2)',
  },
});
