import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useContext } from 'react';
import 'react-native-reanimated';

import { TokenContext, TokenProvider, MarketMetrics, TokenType } from '@/context/tokenData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { fetchDexScreenerBatches } from '@/utils/fetchDexScreenerData';
import { transformRawData } from '@/utils/transformRawData';
import axios from 'axios';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function Layout() {
  const colorScheme = useColorScheme();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { setTokenList, setMarketMetrics } = useContext(TokenContext);
  const [loaded] = useFonts({
    inter: require('../assets/fonts/Inter.ttf'),
  });

    useEffect(() => {
    async function prepare() {
      try {
        await fetchYourData(setTokenList, setMarketMetrics);
        setIsDataLoaded(true);
      } catch (e) {
        console.warn(e);
        setIsDataLoaded(true);
      }
    }
  
    prepare();
  }, [setTokenList, setMarketMetrics]);

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

async function fetchYourData(
  setTokenList: React.Dispatch<React.SetStateAction<TokenType[]>>,
  setMarketMetrics: React.Dispatch<React.SetStateAction<MarketMetrics>>
) {
  try {
    const { data: rawData } = await axios.get('https://believeapp-dummy.vercel.app/api/tokens/explore.json');
    const transformedTokens = transformRawData(rawData);
    const updatedTokens = await fetchDexScreenerBatches(transformedTokens);
    setTokenList(updatedTokens);

    const { data: metricsData } = await axios.get('https://believeapp-dummy.vercel.app/api/dashboard/metrics.json');
    setMarketMetrics(metricsData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export default function RootLayout() {
  return (
    <TokenProvider>
      <Layout />
    </TokenProvider>
  );
}