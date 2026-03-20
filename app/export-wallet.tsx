import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

const mockEncryptedExport = async () => {
  const walletData = await SecureStore.getItemAsync('auraw:wallet-export');
  const payload = walletData || '{}';
  const encryptedPayload = globalThis.btoa ? globalThis.btoa(payload) : payload;
  return JSON.stringify({
    version: 1,
    encrypted: true,
    data: encryptedPayload,
    exportedAt: Date.now(),
  });
};

export default function ExportWalletScreen() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const exportWallet = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      await mockEncryptedExport();
      setStatusMessage('Encrypted wallet export generated.');
    } catch {
      setStatusMessage('Failed to export wallet.');
      Alert.alert('Export failed', 'Unable to export encrypted wallet right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Navigates to the previous screen"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Export Wallet</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Ionicons name="document-text-outline" size={42} color="rgba(255,255,255,0.5)" />
        <Text style={styles.headline}>Encrypted Export</Text>
        <Pressable style={styles.actionBtn} onPress={exportWallet} disabled={loading}>
          <Text style={styles.actionBtnText}>{loading ? 'Exporting...' : 'Export Encrypted Wallet'}</Text>
        </Pressable>
        {statusMessage ? <Text style={styles.text}>{statusMessage}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  placeholder: { width: 40 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  headline: { fontSize: 20, fontWeight: '700', color: '#fff', marginTop: 14, marginBottom: 8 },
  text: { fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 20 },
  actionBtn: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
});
