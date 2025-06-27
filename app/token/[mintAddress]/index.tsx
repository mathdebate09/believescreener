import { useLocalSearchParams, router } from 'expo-router';
import { View, Pressable, Image, Share, Alert, Dimensions } from 'react-native';
import { useContext, useState, useEffect, useRef } from 'react';
import { TokenContext, TokenType } from '@/context/tokenData';
import { TokenMetadata } from '../screens/TokenMetadata';
import { NotificationBar } from '@/components/NotificationBar';
import { Text } from '@/components/ui/CustomText';
import { align, bdr, flex, fx, h, justify, m, p, text, w, z } from 'nativeflowcss';
import { ChevronLeft } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { TokenGraph } from '../screens/TokenGraph';
import { TokenHolderList } from '../screens/TokenHolderList';
import { fetchDexScreenerBatches } from '@/utils/fetchDexScreenerData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TokenDetail() {
  const [currentScreen, setCurrentScreen] = useState('info');
  const { mintAddress } = useLocalSearchParams();
  const { tokenList } = useContext(TokenContext);
  const [updatedToken, setUpdatedToken] = useState<TokenType | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const contextToken = tokenList.find(t => t.mintadd === mintAddress);
      const insets = useSafeAreaInsets();
          const screenHeight = Dimensions.get('window').height;

  const headerHeight = 110;
    const bottomSpacing = insets.bottom + 110;
    const disclaimerHeight = 50;
    const availableHeight = screenHeight - headerHeight - bottomSpacing - disclaimerHeight;
    const chartHeight = Math.max(availableHeight * 1.1, 400) + 40;

  useEffect(() => {
    if (contextToken) {
      setUpdatedToken(contextToken);
    }
  }, [contextToken]);

  useEffect(() => {
    const updateTokenData = async () => {
      if (contextToken) {
        console.log(`Updating single token data for ${contextToken.name}...`);
        try {
          const updatedTokens = await fetchDexScreenerBatches([contextToken]);
          if (updatedTokens.length > 0) {
            setUpdatedToken(updatedTokens[0]);
          }
        } catch (error) {
          console.error('Error updating single token data:', error);
        }
      }
    };

    if (contextToken) {
      updateTokenData();
      intervalRef.current = setInterval(updateTokenData, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [contextToken, contextToken?.mintadd]);

  const token = updatedToken || contextToken;

  if (!token) {
    return null;
  }

  const handleShare = async () => {
    try {
      const shareUrl = `https://believe.app/coin/${token.mintadd}`;
      await Share.share({
        message: `Check out ${token.name} on Believe App: ${shareUrl}`,
        url: shareUrl,
        title: `${token.name} Token`
      });
    } catch {
      Alert.alert('Error', 'Failed to share token');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={[flex.f_1, fx.bg_color_(Colors.black), h.h_('100%')]}>
      <View style={[fx.bg_color_(Colors.gray), z.index_10]}>
        <NotificationBar />
        <View style={[flex.row, flex.gap_3, align.items_center, justify.between, p.px_3, h.h_20]}>
          <Pressable
            onPress={handleGoBack}
            style={[p.p_2, flex.row, align.items_center, justify.center]}
          >
            <ChevronLeft size={24} color="#ECEDEE" />
          </Pressable>

          <View style={[flex.row, flex.gap_2, flex.f_1, justify.center]}>
            <Image
              source={{ uri: token.img.logo }}
              style={[bdr.rounded_lg, h.h_8, w.w_8]}
            />
            <Text weight={"bold"} style={[text.fs_2xl, text.color_zinc_100]}>
              {token.name}
            </Text>
          </View>

          <Pressable
            onPress={handleShare}
            style={[p.p_2, flex.row, align.items_center, justify.center]}
          >
            <Ionicons name="share-outline" size={24} color="#ECEDEE" />
          </Pressable>
        </View>
      </View>

      {/* Floating Tab Navigation */}
      <View style={[
        flex.row,
        fx.bg_color_zinc_900,
        bdr.rounded_full,
        p.p_1,
        bdr.w_1,
        bdr.color_zinc_700,
        fx.bg_transparent,
        align.items_center,
        justify.center,
        { marginHorizontal: 'auto' },
        { marginBottom: -100 },
        m.mt_4,
        z.index_10
      ]}>
        <Pressable
          onPress={() => setCurrentScreen('info')}
          style={[
            flex.row,
            align.items_center,
            justify.center,
            p.px_6,
            p.py_3,
            bdr.rounded_full,
            currentScreen === 'info' ? fx.bg_color_zinc_100 : fx.bg_transparent,
            { minWidth: 80 }
          ]}
        >
          <Text
            weight="bold"
            style={[
              text.fs_sm,
              currentScreen === 'info' ? text.color_zinc_900 : text.color_zinc_400
            ]}
          >
            Info
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setCurrentScreen('graph')}
          style={[
            flex.row,
            align.items_center,
            justify.center,
            p.px_6,
            p.py_3,
            bdr.rounded_full,
            currentScreen === 'graph' ? fx.bg_color_zinc_100 : fx.bg_transparent,
            { minWidth: 80 }
          ]}
        >
          <Text
            weight="bold"
            style={[
              text.fs_sm,
              currentScreen === 'graph' ? text.color_zinc_900 : text.color_zinc_400
            ]}
          >
            Chart
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setCurrentScreen('holder')}
          style={[
            flex.row,
            align.items_center,
            justify.center,
            p.px_6,
            p.py_3,
            bdr.rounded_full,
            currentScreen === 'holder' ? fx.bg_color_zinc_100 : fx.bg_transparent,
            { minWidth: 80 }
          ]}
        >
          <Text
            weight="bold"
            style={[
              text.fs_sm,
              currentScreen === 'holder' ? text.color_zinc_900 : text.color_zinc_400
            ]}
          >
            Holders
          </Text>
        </Pressable>
      </View>

      <TokenGraph token={token} style={[currentScreen === 'graph' ? fx.opacity_100 : fx.opacity_0, currentScreen === 'graph' ? {marginBottom: 0} : {marginBottom: (-1 * chartHeight)} ]}/>
      {currentScreen === 'info' && <TokenMetadata token={token} />}
      {currentScreen === 'holder' && <TokenHolderList token={token} />}
    </View>
  );
}