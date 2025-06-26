import { Text } from '@/components/ui/CustomText';
import { TokenType } from '@/context/tokenData';
import { formatCryptoNumber } from '@/utils/formatNumbers';
import { router } from 'expo-router';
import { align, bdr, flex, h, justify, p, text, w } from "nativeflowcss";
import { Image, TouchableOpacity, View } from 'react-native';

export const TokenListView = ({ item }: { item: TokenType }) => (
  <TouchableOpacity 
    onPress={() => router.push({
      pathname: `/token/${item.mintadd}` as any,
      params: {
        transition: 'default',
      }
    })}
    activeOpacity={0.7}
  >
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
          <Text weight="heavy" style={[text.color_zinc_100, text.fs_xs]}>${item.price.usd.toFixed(4)}</Text>
          <Text weight="medium" style={[text.color_zinc_500, text.fs_xs]}>5H <Text weight="heavy" style={[text.color_zinc_100, item.priceChange.sixH >= 0 ? text.color_green_500 : text.color_red_500]}>{item.priceChange.sixH.toFixed(2)}%</Text></Text>
          <Text weight="medium" style={[text.color_zinc_500, text.fs_xs]}>24H <Text weight="heavy" style={[text.color_zinc_100, item.priceChange.twentyFourH >= 0 ? text.color_green_500 : text.color_red_500]}>{item.priceChange.twentyFourH.toFixed(2)}%</Text></Text>
        </View>
        <View style={[flex.row, flex.gap_1]}>
          <Text weight="medium" style={[text.color_zinc_500, { fontSize: 9}, p.p_1, bdr.w_1, bdr.color_zinc_700, bdr.rounded_md]}>LIQ <Text style={[text.color_zinc_100]}>${formatCryptoNumber(item.tokenomics.liquidity)}</Text></Text>
          <Text weight="medium" style={[text.color_zinc_500, { fontSize: 9}, p.p_1, bdr.w_1, bdr.color_zinc_700, bdr.rounded_md]}>VOL <Text style={[text.color_zinc_100]}>${formatCryptoNumber(item.tokenomics.volume.twentyFourH)}</Text></Text>
          <Text weight="medium" style={[text.color_zinc_500, { fontSize: 9}, p.p_1, bdr.w_1, bdr.color_zinc_700, bdr.rounded_md]}>MCAP <Text style={[text.color_zinc_100]}>${formatCryptoNumber(item.tokenomics.marketCap)}</Text></Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);