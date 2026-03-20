import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BackupCloudScreen() {
  const [icloudEnabled, setIcloudEnabled] = useState(false);
  const [driveEnabled, setDriveEnabled] = useState(false);
  const insets = useSafeAreaInsets();
  const showIcloud = Platform.OS === 'ios';
  const showDrive = Platform.OS === 'android';
  const showDivider = showIcloud && showDrive;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Cloud Backup</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Encrypted backups keep your wallet recoverable on a new device.
        </Text>

        <View style={styles.card}>
          {showIcloud && (
            <View style={styles.row}>
              <View>
                <Text style={styles.rowTitle}>iCloud Backup</Text>
                <Text style={styles.rowSub}>iOS encrypted backup</Text>
              </View>
              <Switch
                value={icloudEnabled}
                onValueChange={setIcloudEnabled}
                accessibilityLabel="Enable iCloud Backup"
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(74,222,128,0.3)' }}
                thumbColor={icloudEnabled ? '#4ade80' : 'rgba(255,255,255,0.5)'}
              />
            </View>
          )}

          {showDivider && <View style={styles.divider} />}

          {showDrive && (
            <View style={styles.row}>
              <View>
                <Text style={styles.rowTitle}>Google Drive Backup</Text>
                <Text style={styles.rowSub}>Android encrypted backup</Text>
              </View>
              <Switch
                value={driveEnabled}
                onValueChange={setDriveEnabled}
                accessibilityLabel="Enable Google Drive Backup"
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(74,222,128,0.3)' }}
                thumbColor={driveEnabled ? '#4ade80' : 'rgba(255,255,255,0.5)'}
              />
            </View>
          )}
        </View>

        <View style={styles.note}>
          <Ionicons name="shield-checkmark-outline" size={18} color="rgba(255,255,255,0.5)" />
          <Text style={styles.noteText}>
            Backups are encrypted before upload. Never share your recovery phrase.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  placeholder: { width: 40 },
  content: { paddingHorizontal: 16, paddingTop: 12 },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 16,
    lineHeight: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  rowTitle: { fontSize: 15, fontWeight: '700', color: '#fff' },
  rowSub: { fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  note: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  noteText: { flex: 1, fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.45)', lineHeight: 18 },
});
