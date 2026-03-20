import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

const NETWORKS = ['Ethereum', 'Arbitrum', 'Base', 'BNB Chain'];

export default function SettingsNetworkScreen() {
  const [selected, setSelected] = useState('Ethereum');
  const [loading, setLoading] = useState(true);
  const STORAGE_KEY = 'defaultNetwork';

  useEffect(() => {
    const loadNetwork = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSelected(stored);
        }
      } catch (error) {
        console.warn('Failed to load network setting:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNetwork();
  }, []);

  const handleSelectNetwork = async (network: string) => {
    setSelected(network);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, network);
    } catch (error) {
      console.warn('Failed to save network setting:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Default Network</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={styles.rowText}>Loading...</Text>
        ) : null}
        {NETWORKS.map((network) => (
          <Pressable key={network} style={styles.row} onPress={() => handleSelectNetwork(network)}>
            <Text style={styles.rowText}>{network}</Text>
            {selected === network && <Ionicons name="checkmark" size={20} color="#4ade80" />}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 58, paddingHorizontal: 16, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  placeholder: { width: 40 },
  content: { paddingHorizontal: 16, paddingBottom: 28 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', marginBottom: 8 },
  rowText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
