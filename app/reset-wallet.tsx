import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function ResetWalletScreen() {
  const handleReset = () => {
    Alert.alert('Reset Wallet', 'This action is permanent in production. Demo route is connected.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive' },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Reset Wallet</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.warning}>
          <Ionicons name="warning-outline" size={20} color="#f87171" />
          <Text style={styles.warningText}>
            This removes wallet data from this device. Ensure your recovery phrase is backed up.
          </Text>
        </View>

        <Pressable style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetBtnText}>Reset Wallet</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 58, paddingHorizontal: 16, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  placeholder: { width: 40 },
  content: { paddingHorizontal: 16, paddingTop: 20 },
  warning: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 12, backgroundColor: 'rgba(248,113,113,0.1)', borderWidth: 1, borderColor: 'rgba(248,113,113,0.2)' },
  warningText: { flex: 1, fontSize: 13, fontWeight: '500', color: '#fca5a5', lineHeight: 19 },
  resetBtn: { marginTop: 18, backgroundColor: '#ef4444', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  resetBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
