import { NotificationBar } from '@/components/NotificationBar';
import { TokenContext, TokenType } from '@/context/tokenData';
import { flex, m, p, text, bdr, h, align, justify, fx } from "nativeflowcss";
import { useContext, useState, useEffect, useRef } from "react";
import { FlatList, View, Pressable, ScrollView } from "react-native";
import { Text } from '@/components/ui/CustomText';
import { formatCryptoNumber } from '@/utils/formatNumbers';
import { sortTokenList } from '@/utils/sortTokenList';
import { Colors, BoxColors } from '@/constants/Colors';
import { TokenListView } from '@/components/TokenListView';
import { fetchDexScreenerBatches } from '@/utils/fetchDexScreenerData';

export default function IndexScreen() {
  const { tokenList, marketMetrics } = useContext(TokenContext);
  const [sortMethod, setSortMethod] = useState<'PRICE' | 'VOL' | 'MCAP' | 'LIQ' | 'TXNS' | 'HOLDER'>('MCAP');
  const [updatedTokenList, setUpdatedTokenList] = useState<TokenType[]>(tokenList);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setUpdatedTokenList(tokenList);
  }, [tokenList]);

  // Setup constant loop for updating token data
  useEffect(() => {
    const updateTokenData = async () => {
      if (updatedTokenList.length > 0) {
        console.log('Updating token data with DexScreener...');
        try {
          const updatedTokens = await fetchDexScreenerBatches(updatedTokenList);
          setUpdatedTokenList(updatedTokens);
        } catch (error) {
          console.error('Error updating token data:', error);
        }
      }
    };

    updateTokenData();

    intervalRef.current = setInterval(updateTokenData, 6000) as unknown as NodeJS.Timeout;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updatedTokenList.length]);

  const SortTab = ({ title, value }: { title: string; value: typeof sortMethod }) => (
    <Pressable
      onPress={() => setSortMethod(value)}
      style={[
        p.px_3,
        p.py_2,
        bdr.rounded_lg,
        sortMethod === value ? fx.bg_color_zinc_700 : {},
        bdr.color_zinc_700,
        bdr.w_1,
      ]}
    >
      <Text
        weight="bold"
        style={[
          text.fs_xs,
          text.color_zinc_100,
          sortMethod === value ? text.color_zinc_100 : text.color_zinc_500
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );

  return (
    <View style={[flex.f_1, fx.bg_color_(Colors.black)]}>
      <View style={[fx.bg_color_(Colors.gray)]}>
        <NotificationBar />
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[p.px_3]}
          style={[h.h_20]}
        >
          <View style={[flex.row, flex.gap_3, align.items_center, justify.center]}>
            <SortTab title="Price" value="PRICE" />
            <SortTab title="Volume" value="VOL" />
            <SortTab title="Market Cap" value="MCAP" />
            <SortTab title="Liquidity" value="LIQ" />
            <SortTab title="Transactions" value="TXNS" />
            <SortTab title="Holders" value="HOLDER" />
          </View>
        </ScrollView>
      </View>

      <View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[p.px_3, flex.gap_5, p.py_3]}
        >
          <View style={[p.p_3, bdr.w_1, bdr.rounded_xl, { borderColor: BoxColors.blue.secondary }, fx.bg_color_(BoxColors.blue.tertiary)]}>
            <Text weight="medium" style={[text.fs_xs, { color: BoxColors.blue.primary }]}>24h Volume</Text>
            <Text weight="black" style={[text.color_(BoxColors.blue.primary), text.fs_lg]}>${formatCryptoNumber(marketMetrics.volume24h.total)}</Text>
            <View style={[flex.row, flex.gap_2, m.mt_2]}>
              <Text weight="medium" style={[{ fontSize: 9, color: BoxColors.blue.secondary }, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.blue.secondary }]}>
                Creator <Text style={[text.color_(BoxColors.blue.secondary)]}>${formatCryptoNumber(marketMetrics.volume24h.creatorCoins)}</Text>
              </Text>
              <Text weight="medium" style={[{ fontSize: 9, color: BoxColors.blue.secondary }, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.blue.secondary }]}>
                Launch <Text style={[text.color_(BoxColors.blue.secondary)]}>${formatCryptoNumber(marketMetrics.volume24h.launchCoin)}</Text>
              </Text>
            </View>
          </View>

          <View style={[p.p_3, bdr.w_1, bdr.rounded_xl, { borderColor: BoxColors.purple.secondary }, fx.bg_color_(BoxColors.purple.tertiary)]}>
            <Text weight="medium" style={[text.fs_xs, { color: BoxColors.purple.primary }]}>Total Market Cap</Text>
            <Text weight="black" style={[text.color_(BoxColors.purple.primary), text.fs_lg]}>${formatCryptoNumber(marketMetrics.totalMarketCap.total)}</Text>
            <View style={[flex.row, flex.gap_2, m.mt_2]}>
              <Text weight="medium" style={[{ fontSize: 9, color: BoxColors.purple.secondary }, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.purple.secondary }]}>
                Active <Text style={[text.color_(BoxColors.purple.secondary)]}>{marketMetrics.activeCoins}</Text>
              </Text>
              <Text weight="medium" style={[{ fontSize: 9, color: BoxColors.purple.secondary }, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.purple.secondary }]}>
                Launches <Text style={[text.color_(BoxColors.purple.secondary)]}>{marketMetrics.coinLaunches}</Text>
              </Text>
            </View>
          </View>

          <View style={[p.p_3, bdr.w_1, bdr.rounded_xl, { borderColor: BoxColors.green.secondary }, fx.bg_color_(BoxColors.green.tertiary)]}>
            <Text weight="medium" style={[text.fs_xs, { color: BoxColors.green.primary }]}>Total Liquidity</Text>
            <Text weight="black" style={[text.color_(BoxColors.green.primary), text.fs_lg]}>${formatCryptoNumber(marketMetrics.totalLiquidity.total)}</Text>
            <View style={[flex.row, flex.gap_2, m.mt_2]}>
              <Text weight="medium" style={[{ fontSize: 9, color: BoxColors.green.secondary }, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.green.secondary }]}>
                Creator <Text style={[text.color_(BoxColors.green.secondary)]}>${formatCryptoNumber(marketMetrics.totalLiquidity.creatorCoins)}</Text>
              </Text>
              <Text weight="medium" style={[{ fontSize: 9, color: BoxColors.green.secondary }, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.green.secondary }]}>
                Launch <Text style={[text.color_(BoxColors.green.secondary)]}>${formatCryptoNumber(marketMetrics.totalLiquidity.launchCoin)}</Text>
              </Text>
            </View>
          </View>

          <View style={[p.p_3, bdr.w_1, bdr.rounded_xl, { borderColor: BoxColors.orange.secondary }, fx.bg_color_(BoxColors.orange.tertiary)]}>
            <Text weight="medium" style={[text.fs_xs, { color: BoxColors.orange.primary }]}>24h Transactions</Text>
            <Text weight="black" style={[text.color_(BoxColors.orange.primary), text.fs_lg]}>{formatCryptoNumber(marketMetrics.transactions24h.total)}</Text>
            <View style={[flex.row, flex.gap_2, m.mt_2]}>
              <Text weight="medium" style={[{ fontSize: 9, color: BoxColors.orange.secondary }, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.orange.secondary }]}>
                Creator <Text style={[text.color_(BoxColors.orange.secondary)]}>{formatCryptoNumber(marketMetrics.transactions24h.creatorCoins)}</Text>
              </Text>
              <Text weight="medium" style={[{ fontSize: 9, color: BoxColors.orange.secondary }, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.orange.secondary }]}>
                Launch <Text style={[text.color_(BoxColors.orange.secondary)]}>{formatCryptoNumber(marketMetrics.transactions24h.launchCoin)}</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={sortTokenList(updatedTokenList, sortMethod)}
        renderItem={TokenListView}
        keyExtractor={(item) => item.mintadd}
        style={[flex.f_1]}
      />
    </View>
  );
}