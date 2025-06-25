import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useContext } from 'react';
import 'react-native-reanimated';

import { TokenContext, TokenProvider } from '@/context/tokenData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { fetchDexScreenerBatches } from '@/utils/fetchDexScreenerData';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function Layout() {
  const colorScheme = useColorScheme();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { setTokenList } = useContext(TokenContext);
  const [loaded] = useFonts({
    inter: require('../assets/fonts/Inter.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Fetch your data here
        await fetchYourData(setTokenList);
        setIsDataLoaded(true);
      } catch (e) {
        console.warn(e);
        setIsDataLoaded(true);
      }
    }

    prepare();
  }, [setTokenList]);

  useEffect(() => {
    if (loaded && isDataLoaded) {
      // Hide splash screen once everything is ready
      SplashScreen.hideAsync();
    }
  }, [loaded, isDataLoaded]);

  if (!loaded || !isDataLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

async function fetchYourData(setTokenList: React.Dispatch<React.SetStateAction<any[]>>) {
  try {
    const staticTokens = require('@/utils/believeAppStatic.json');
    const updatedTokens = await fetchDexScreenerBatches(staticTokens);
    
    setTokenList(updatedTokens);
  } catch (error) {
    console.error('Error fetching token data:', error);
  }
}

export default function RootLayout() {
  return (
    <TokenProvider>
      <Layout />
    </TokenProvider>
  );
}