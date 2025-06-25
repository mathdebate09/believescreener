import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useContext } from 'react';
import 'react-native-reanimated';

import { TokenContext, TokenProvider, MarketMetrics, TokenType } from '@/context/tokenData';
import { fetchDexScreenerBatches } from '@/utils/fetchDexScreenerData';
import { transformRawData } from '@/utils/transformRawData';
import axios from 'axios';
import { Colors } from '@/constants/Colors';
import { sortTokenList } from '@/utils/sortTokenList';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function Layout() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { setTokenList, setMarketMetrics } = useContext(TokenContext);
  const [loaded] = useFonts({
    SFPro: require('../assets/fonts/SFpro/SF-Pro-Display-Regular.ttf'),
  });

  const customTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.black,
  },
};

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
    <ThemeProvider value={customTheme}>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
    <StatusBar style="light" />
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
    const sortedTokens = sortTokenList(updatedTokens, 'MCAP'); 
    setTokenList(sortedTokens);

    const { data: metricsData } = await axios.get('https://believeapp-dummy.vercel.app/api/dashboard/metrics.json');
    console.log(metricsData);
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