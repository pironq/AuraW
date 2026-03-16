import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

import AuraLogo from '@/components/AuraLogo';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.center}>
        <AuraLogo size={48} isDark />
        <Ionicons name="settings-outline" size={32} color="rgba(255,255,255,0.2)" style={{ marginTop: 20 }} />
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Wallet settings coming soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 8,
  },
});
