import {View, Text, ViewStyle, Image} from "react-native";
import { NotificationBar } from '@/components/NotificationBar';
import { TokenContext } from '@/context/tokenData';

import { align, flex, m, text } from "nativeflowcss";
import { useContext } from "react";

export default function IndexScreen() {
  const { tokenList } = useContext(TokenContext);

  return (
    <View style={[flex.f_1 as ViewStyle]}>
      <NotificationBar />
      <Text style={[text.fs_2xl, text.fw_bold, m.m_4, text.color_zinc_100]}>
        Index
      </Text>
      {tokenList.length > 0 && (
        <View>
          {tokenList[0].img.banner && (
            <Image 
              source={{ uri: tokenList[0].img.banner }} 
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />
          )}
          <View style={[flex.row, m.m_4, align.items_center]}>
            {tokenList[0].img.logo && (
              <Image 
                source={{ uri: tokenList[0].img.logo }} 
                style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                resizeMode="contain"
              />
            )}
            <Text style={[text.fs_2xl, text.fw_bold, text.color_red_500]}>
              {tokenList[0].ticker} ({tokenList[0].name})
            </Text>
          </View>
          <Text style={[text.fs_2xl, text.fw_bold, m.m_4, text.color_zinc_100]}>
            Description: {tokenList[0].description}{'\n'}
            Price: ${tokenList[0].price.toFixed(4)}{'\n'}
            DEX: {tokenList[0].dexId}{'\n'}
            Price Change 5H: {tokenList[0].priceChange.fiveH.toFixed(2)}%{'\n'}
            Price Change 24H: {tokenList[0].priceChange.twentyFourH.toFixed(2)}%{'\n'}
            Transactions - Buys: {tokenList[0].txn.buys} Sells: {tokenList[0].txn.sells}{'\n'}
            Market Cap: ${tokenList[0].tokenomics.marketCap.toLocaleString()}{'\n'}
            Volume 5H: ${tokenList[0].tokenomics.volume.fiveH.toLocaleString()}{'\n'}
            Volume 24H: ${tokenList[0].tokenomics.volume.twentyFourH.toLocaleString()}{'\n'}
            Holders: {tokenList[0].tokenomics.holder}{'\n'}
            Liquidity: ${tokenList[0].tokenomics.liquidity.toLocaleString()}{'\n'}
            Mint Address: {tokenList[0].mintadd}
          </Text>
        </View>
      )}
    </View>
  );
}