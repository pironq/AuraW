import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface AuraLogoProps {
  size?: number;
  isDark?: boolean;
}

export default function AuraLogo({ size = 72, isDark = false }: AuraLogoProps) {
  return (
    <Image
      source={require('../assets/images/AuraLogo.png')}
      style={[
        { width: size, height: size },
        isDark && styles.invertedLogo,
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  invertedLogo: {
    tintColor: '#fff',
  },
});
