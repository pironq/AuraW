import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

export {
    ErrorBoundary
} from 'expo-router';

const DEV_MODE = __DEV__ || process.env.EXPO_PUBLIC_DEV_MODE === 'true';

export const unstable_settings = {
  initialRouteName: DEV_MODE ? '(tabs)' : 'index',
};

if (!__DEV__ && process.env.EXPO_PUBLIC_DEV_MODE === 'true') {
  throw new Error('EXPO_PUBLIC_DEV_MODE must not be true for production builds.');
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="create-wallet" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="import-wallet" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="add-wallet" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="generating" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="seed-phrase" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="verify-phrase" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="wallet-ready" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="manage-tokens" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="send" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="send-amount" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="send-address" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="send-confirm" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="receive" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="receive-token" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="qr-scanner" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="security-verify" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="view-private-key" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="view-recovery-phrase" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="privacy" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="terms" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="support" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="backup-cloud" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="settings-currency" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="settings-network" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="change-pin" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="export-wallet" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="reset-wallet" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="token-detail" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </ThemeProvider>
  );
}
