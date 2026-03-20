import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function ExportWalletScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Export Wallet</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Ionicons name="document-text-outline" size={42} color="rgba(255,255,255,0.5)" />
        <Text style={styles.headline}>Encrypted Export</Text>
        <Text style={styles.text}>
          Export route is active. You can now connect this screen to encrypted file export and sharing.
        </Text>
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
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  headline: { fontSize: 20, fontWeight: '700', color: '#fff', marginTop: 14, marginBottom: 8 },
  text: { fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 20 },
});
