import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

export {
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

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
        <Stack.Screen name="generating" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="seed-phrase" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="verify-phrase" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="wallet-ready" options={{ animation: 'fade', gestureEnabled: false }} />
      </Stack>
    </ThemeProvider>
  );
}
