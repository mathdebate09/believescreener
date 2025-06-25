import { NotificationBar } from '@/components/NotificationBar';
import { TokenContext, TokenType } from '@/context/tokenData';
import { flex, m, p, text, bdr, h, w, align, justify, fx } from "nativeflowcss";
import { useContext, useState } from "react";
import { FlatList, Image, View, Pressable, ScrollView } from "react-native";
import { Text } from '@/components/ui/CustomText';
import { formatCryptoNumber } from '@/utils/formatNumbers';
import { sortTokenList } from '@/utils/sortTokenList';
import { Colors } from '@/constants/Colors';

export default function IndexScreen() {
  const { tokenList, marketMetrics } = useContext(TokenContext);
  const [sortMethod, setSortMethod] = useState<'PRICE' | 'VOL' | 'MCAP' | 'LIQ' | 'TXNS' | 'HOLDER'>('MCAP');

  const renderTokenItem = ({ item }: { item: TokenType }) => (
    <View style={[p.px_3, p.py_3, bdr.color_zinc_500, bdr.b_w_(0.5),flex.f_1, flex.row]}>
        <View style={[flex.row, flex.f_1, align.items_center, flex.gap_2]}>
          <Image
          source={{ uri: item.img.logo || 'https://dpiknhejtrohakoouanp.supabase.co/storage/v1/object/public/profile-images/clout/6484b5f1-05ed-4f04-bc2d-7699ae89e4a2-avatar_307FA8A3-67DB-4EB8-B87F-11B46A9ED809.jpg' }} 
          style={[w.w_12, h.h_12, bdr.rounded_2xl]}
          resizeMode="contain" 
          />
          <View style={[flex.col, { marginTop: -3 }]}>
            <Text weight="black" style={[text.color_zinc_100, text.fs_base]}>{item.ticker}</Text>
            <Text weight="bold" style={[text.color_zinc_100, text.fs_xs, text.color_zinc_500]}>{item.name}</Text>
          </View>
        </View>
        <View style={[flex.end, align.items_end, justify.center, flex.gap_1, { marginBottom: -3 }]}>
          <View style={[flex.row, flex.gap_2]}>
            <Text weight="heavy" style={[text.color_zinc_100, text.fs_xs]}>${item.price.toFixed(4)}</Text>
            <Text weight="medium" style={[text.color_zinc_500, text.fs_xs]}>5H <Text weight="heavy" style={[text.color_zinc_100, item.priceChange.fiveH >= 0 ? text.color_green_500 : text.color_red_500]}>{item.priceChange.fiveH.toFixed(2)}%</Text></Text>
            <Text weight="medium" style={[text.color_zinc_500, text.fs_xs]}>24H <Text weight="heavy" style={[text.color_zinc_100, item.priceChange.twentyFourH >= 0 ? text.color_green_500 : text.color_red_500]}>{item.priceChange.twentyFourH.toFixed(2)}%</Text></Text>
          </View>
          <View style={[flex.row, flex.gap_1]}>
            <Text weight="medium" style={[text.color_zinc_500, { fontSize: 9}, p.p_1, bdr.w_1, bdr.color_zinc_700, bdr.rounded_md]}>LIQ <Text style={[text.color_zinc_100]}>${formatCryptoNumber(item.tokenomics.liquidity)}</Text></Text>
            <Text weight="medium" style={[text.color_zinc_500, { fontSize: 9}, p.p_1, bdr.w_1, bdr.color_zinc_700, bdr.rounded_md]}>VOL <Text style={[text.color_zinc_100]}>${formatCryptoNumber(item.tokenomics.volume.twentyFourH)}</Text></Text>
            <Text weight="medium" style={[text.color_zinc_500, { fontSize: 9}, p.p_1, bdr.w_1, bdr.color_zinc_700, bdr.rounded_md]}>MCAP <Text style={[text.color_zinc_100]}>${formatCryptoNumber(item.tokenomics.marketCap)}</Text></Text>
          </View>
        </View>
    </View>
  );

  const BoxColors = {
    blue: {
      primary: '#3B82F6',
      secondary: 'rgba(59, 130, 246, 0.7)',
      tertiary: '#050A12' // Very dark blue hint
    },
    purple: {
      primary: '#8B5CF6',
      secondary: 'rgba(139, 92, 246, 0.7)',
      tertiary: '#130A23' // Very dark purple hint
    },
    green: {
      primary: '#10B981',
      secondary: 'rgba(16, 185, 129, 0.7)',
      tertiary: '#071911' // Very dark green hint
    },
    orange: {
      primary: '#F97316',
      secondary: 'rgba(249, 115, 22, 0.7)',
      tertiary: '#1E1208' // Very dark orange hint
    }
  };


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
              <Text weight="medium" style={[{fontSize: 9, color: BoxColors.blue.secondary}, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.blue.secondary }]}>
                Creator <Text style={[text.color_(BoxColors.blue.secondary)]}>${formatCryptoNumber(marketMetrics.volume24h.creatorCoins)}</Text>
              </Text>
              <Text weight="medium" style={[{fontSize: 9, color: BoxColors.blue.secondary}, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.blue.secondary }]}>
                Launch <Text style={[text.color_(BoxColors.blue.secondary)]}>${formatCryptoNumber(marketMetrics.volume24h.launchCoin)}</Text>
              </Text>
            </View>
          </View>

          <View style={[p.p_3, bdr.w_1, bdr.rounded_xl, { borderColor: BoxColors.purple.secondary }, fx.bg_color_(BoxColors.purple.tertiary)]}>
            <Text weight="medium" style={[text.fs_xs, { color: BoxColors.purple.primary }]}>Total Market Cap</Text>
            <Text weight="black" style={[text.color_(BoxColors.purple.primary), text.fs_lg]}>${formatCryptoNumber(marketMetrics.totalMarketCap.total)}</Text>
            <View style={[flex.row, flex.gap_2, m.mt_2]}>
              <Text weight="medium" style={[{fontSize: 9, color: BoxColors.purple.secondary}, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.purple.secondary }]}>
                Active <Text style={[text.color_(BoxColors.purple.secondary)]}>{marketMetrics.activeCoins}</Text>
              </Text>
              <Text weight="medium" style={[{fontSize: 9, color: BoxColors.purple.secondary}, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.purple.secondary }]}>
                Launches <Text style={[text.color_(BoxColors.purple.secondary)]}>{marketMetrics.coinLaunches}</Text>
              </Text>
            </View>
          </View>

          <View style={[p.p_3, bdr.w_1, bdr.rounded_xl, { borderColor: BoxColors.green.secondary }, fx.bg_color_(BoxColors.green.tertiary)]}>
            <Text weight="medium" style={[text.fs_xs, { color: BoxColors.green.primary }]}>Total Liquidity</Text>
            <Text weight="black" style={[text.color_(BoxColors.green.primary), text.fs_lg]}>${formatCryptoNumber(marketMetrics.totalLiquidity.total)}</Text>
            <View style={[flex.row, flex.gap_2, m.mt_2]}>
              <Text weight="medium" style={[{fontSize: 9, color: BoxColors.green.secondary}, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.green.secondary }]}>
                Creator <Text style={[text.color_(BoxColors.green.secondary)]}>${formatCryptoNumber(marketMetrics.totalLiquidity.creatorCoins)}</Text>
              </Text>
              <Text weight="medium" style={[{fontSize: 9, color: BoxColors.green.secondary}, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.green.secondary }]}>
                Launch <Text style={[text.color_(BoxColors.green.secondary)]}>${formatCryptoNumber(marketMetrics.totalLiquidity.launchCoin)}</Text>
              </Text>
            </View>
          </View>

          <View style={[p.p_3, bdr.w_1, bdr.rounded_xl, { borderColor: BoxColors.orange.secondary }, fx.bg_color_(BoxColors.orange.tertiary)]}>
            <Text weight="medium" style={[text.fs_xs, { color: BoxColors.orange.primary }]}>24h Transactions</Text>
            <Text weight="black" style={[text.color_(BoxColors.orange.primary), text.fs_lg]}>{formatCryptoNumber(marketMetrics.transactions24h.total)}</Text>
            <View style={[flex.row, flex.gap_2, m.mt_2]}>
              <Text weight="medium" style={[{fontSize: 9, color: BoxColors.orange.secondary}, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.orange.secondary }]}>
                Creator <Text style={[text.color_(BoxColors.orange.secondary)]}>{formatCryptoNumber(marketMetrics.transactions24h.creatorCoins)}</Text>
              </Text>
              <Text weight="medium" style={[{fontSize: 9, color: BoxColors.orange.secondary}, p.p_1, bdr.w_1, bdr.rounded_md, { borderColor: BoxColors.orange.secondary }]}>
                Launch <Text style={[text.color_(BoxColors.orange.secondary)]}>{formatCryptoNumber(marketMetrics.transactions24h.launchCoin)}</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
      
      <FlatList
        data={sortTokenList(tokenList, sortMethod)}
        renderItem={renderTokenItem}
        keyExtractor={(item) => item.mintadd}
        style={[flex.f_1]}
      />
    </View>
  );
}