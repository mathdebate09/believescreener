import { ExternalLink } from '@/components/ExternalLink';
import { Text } from '@/components/ui/CustomText';
import { BoxColors, Colors } from '@/constants/Colors';
import { TokenContext, TokenType } from '@/context/tokenData';
import { formatCryptoNumber } from '@/utils/formatNumbers';
import { Copy, Check, ChevronRight, ChartCandlestick, Star } from 'lucide-react-native';
import { align, bdr, flex, fx, h, justify, m, p, text, w, z } from 'nativeflowcss';
import React from 'react';
import { Image, Pressable, View, Animated, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TokenMetadataProps {
  token: TokenType;
}

interface TokenDescriptionProps {
  description: string;
}

const TokenDescription: React.FC<TokenDescriptionProps> = ({ description }) => {
  if (!description) return null;
  
  const cleanDescription = description
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
  
  if (!cleanDescription) return null;
  
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = cleanDescription.split(urlRegex);
  
  return (
    <View style={[p.px_4, p.py_3, bdr.rounded_lg, fx.bg_color_zinc_900, m.mx_3, m.mt_2]}>
      <Text style={[text.color_zinc_100, text.align_left, text.fs_sm, text.leading_relaxed]}>
        {parts.map((part, index) => {
          if (urlRegex.test(part)) {
            const displayUrl = part.length > 40 ? `${part.substring(0, 40)}...` : part;
            return (
              <ExternalLink 
                key={index} 
                href={part as any}
              >
                <Text style={[text.color_blue_400, text.underline]}>
                  {displayUrl}
                </Text>
              </ExternalLink>
            );
          }
          return part;
        })}
      </Text>
    </View>
  );
};

export const TokenMetadata = ({ token }: TokenMetadataProps) => {
  const [imageError, setImageError] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { setTokenList } = React.useContext(TokenContext);
  const insets = useSafeAreaInsets();

  const toggleFavouriteStatus = (mintAddress: string) => {
    setTokenList(prevTokenList => 
      prevTokenList.map(token => 
        token.mintadd === mintAddress 
          ? { ...token, watchlist: !token.watchlist }
          : token
      )
    );
  };

  const handleCopy = () => {
    setIsCopied(true);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsCopied(false);
      });
    }, 1500);
  };

  return (
      <ScrollView style={[flex.f_1, p.pt_(110)]} showsVerticalScrollIndicator={false}>
        <View style={[p.px_3]}>
          <View style={[flex.row, align.items_center, justify.center, flex.gap_3]}>
            <Text weight="bold" style={[text.fs_base, text.color_zinc_100]}>
              ${token.ticker}
            </Text>
            <Pressable
              onPress={handleCopy}
              style={[
                text.fs_xs,
                flex.row, 
                align.items_center, 
                flex.gap_2, 
                p.px_2, 
                p.py_1, 
                bdr.rounded_lg,
                bdr.w_1,
                bdr.color_zinc_500
              ]}
            >
              {isCopied ? (
                <Animated.View style={[flex.row, align.items_center, flex.gap_2, { opacity: fadeAnim }]}>
                  <Text style={[text.fs_xs, text.color_zinc_300]}>
                    Copied!
                  </Text>
                  <Check size={12} color="#9CA3AF" />
                </Animated.View>
              ) : (
                <>
                  <Text style={[text.fs_xs, text.color_zinc_300]}>
                    Copy CA
                  </Text>
                  <Copy size={12} color="#9CA3AF" />
                </>
              )}
            </Pressable>
          </View>
        </View>
        <View style={[flex.row, align.items_center, justify.center, p.px_3, flex.gap_1, p.pb_3, p.pt_1]}>
          <Image
            source={require('@/assets/images/logos/solana.png')}
            style={[h.h_3, w.w_3]}
            resizeMode='contain'
          />
          <Text weight="bold" style={[text.color_zinc_400]}>Solana</Text>
          <ChevronRight size={12} color="#9CA3AF" />
          
          {token.dexId === 'meteora' ? (
          <>
            <Image
              source={require(`@/assets/images/logos/meteora.png`)}
              style={[h.h_3, w.w_3]}
              resizeMode='contain'
            />
            <Text weight="bold" style={[text.color_zinc_400]}>meteora</Text>
          </>
          ) : (
          <>
            <Image
            source={require(`@/assets/images/logos/raydium.png`)}
            style={[h.h_3, w.w_3]}
            resizeMode='contain'
            />
            <Text weight="bold" style={[text.color_zinc_400]}>Raydium</Text>
        </>
          )}
          <ChevronRight size={12} color="#9CA3AF" />
          
          <Image
            source={require('@/assets/images/logos/believe.png')}
            style={[h.h_3, w.w_3]}
            resizeMode='contain'
          />
          <Text weight="bold" style={[text.color_zinc_400]}>Believe</Text>
        </View>
        <Image
          source={
            !imageError && token.img.banner && token.img.banner.startsWith('http')
              ? { uri: token.img.banner }
              : require('@/assets/images/banner.png')
          }
          style={[imageError ? { marginLeft: -90 } : h.h_36, h.h_36]}
          resizeMode='cover'
          onError={() => setImageError(true)}
        />
        <View style={[flex.row, { marginHorizontal: 'auto'}, { marginTop: -20}]}>
          <ExternalLink
            href={`https://believe.app/coin/${token.mintadd}`}
          >
            <View style={[p.pl_1, p.pr_2, bdr.rounded_l_(100), p.py_2, bdr.w_1, bdr.color_zinc_500, fx.bg_color_(Colors.black), flex.row, align.items_center, justify.center]}>
              <Image
                source={require('@/assets/images/logos/believe.png')}
                style={[h.h_4]}
                resizeMode='contain'
              />
              <Text weight="bold" style={[text.fs_xs, text.color_(Colors.green)]}>
                View on Believe App
              </Text> 
            </View>
          </ExternalLink>
          <ExternalLink
            href={`https://solscan.io/token/${token.mintadd}`}
            style={[{ marginLeft: -4 }]}
          >
                      
            <View style={[p.pr_4, p.pl_2, bdr.rounded_r_(100), p.py_1, bdr.w_1, bdr.color_zinc_500, fx.bg_color_(Colors.black), flex.row, align.items_center, justify.center, flex.gap_1]}>
              <Text weight="bold" style={[text.fs_xs, text.color_zinc_100]}>
                View on
              </Text> 
              <Image
                source={require('@/assets/images/logos/solscan.png')}
                style={[w.w_16]}
                resizeMode='contain'
              />
            </View>
            
          </ExternalLink>
        </View>
        <TokenDescription description={token.description} />
            
        <View style={[flex.row, align.items_center, justify.between, p.px_3, p.py_4, flex.gap_4]}>
          <View style={[flex.f_1, p.p_2, bdr.rounded_lg, bdr.w_1, bdr.color_zinc_500, flex.gap_1, fx.bg_transparent, align.items_center]}>
            <Text style={[text.fs_xs, text.color_zinc_400, text.align_center]} weight="medium">
              PRICE USD
            </Text>
            <Text style={[text.fs_lg, text.color_zinc_100, text.align_center]} weight="bold">
              ${token.price.usd.toFixed(6)}
            </Text>
          </View>
          <View style={[flex.f_1, p.p_2, bdr.rounded_lg, bdr.w_1, bdr.color_zinc_500, flex.gap_1, fx.bg_transparent, align.items_center]}>
            <Text style={[text.fs_xs, text.color_zinc_400, text.align_center]} weight="medium">
              PRICE SOL
            </Text>
            <Text style={[text.fs_lg, text.color_zinc_100, text.align_center]} weight="bold">
              {token.price.sol.toFixed(6)}
            </Text>
          </View>
        </View>
        <View style={[flex.row, justify.between, p.px_3, flex.gap_4, p.pb_4]}>
          <View style={[flex.f_1, p.p_2, bdr.rounded_lg, bdr.w_1, bdr.color_zinc_500, fx.bg_transparent, align.items_center]}>
            <Text style={[text.fs_xs, text.color_zinc_400, text.align_center, p.pb_1]} weight="medium">
              5M
            </Text>
            <Text
              style={[
                text.fs_sm,
                text.align_center,
                token.priceChange.fiveM < 0 ? text.color_red_400 : text.color_green_400
              ]}
              weight="bold"
            >
              {token.priceChange.fiveM}%
            </Text>
          </View>
          <View style={[flex.f_1, p.p_2, bdr.rounded_lg, bdr.w_1, bdr.color_zinc_500, fx.bg_transparent, align.items_center]}>
            <Text style={[text.fs_xs, text.color_zinc_400, text.align_center, p.pb_1]} weight="medium">
              1H
            </Text>
            <Text
              style={[
                text.fs_sm,
                text.align_center,
                token.priceChange.oneH < 0 ? text.color_red_400 : text.color_green_400
              ]}
              weight="bold"
            >
              {token.priceChange.oneH}%
            </Text>
          </View>
          <View style={[flex.f_1, p.p_2, bdr.rounded_lg, bdr.w_1, bdr.color_zinc_500, fx.bg_transparent, align.items_center]}>
            <Text style={[text.fs_xs, text.color_zinc_400, text.align_center, p.pb_1]} weight="medium">
              6H
            </Text>
            <Text
              style={[
                text.fs_sm,
                text.align_center,
                token.priceChange.sixH < 0 ? text.color_red_400 : text.color_green_400
              ]}
              weight="bold"
            >
              {token.priceChange.sixH}%
            </Text>
          </View>
          <View style={[flex.f_1, p.p_2, bdr.rounded_lg, bdr.w_1, bdr.color_zinc_500, fx.bg_transparent, align.items_center]}>
            <Text style={[text.fs_xs, text.color_zinc_400, text.align_center, p.pb_1]} weight="medium">
              24H
            </Text>
            <Text
              style={[
                text.fs_sm,
                text.align_center,
                token.priceChange.twentyFourH < 0 ? text.color_red_400 : text.color_green_400
              ]}
              weight="bold"
            >
              {token.priceChange.twentyFourH}%
            </Text>
          </View>
        </View>

        { /* Transaciton Section */}
        <View style={[p.px_3, p.pb_4]}>
          <View style={[bdr.rounded_lg, bdr.w_1, bdr.color_zinc_500, fx.bg_transparent, p.p_3]}>
            <View style={[flex.row, justify.between, align.items_center, p.pb_2]}>
              <Text style={[text.fs_xs, text.color_zinc_400]} weight="medium">
                TRANSACTIONS
              </Text>
              <Text style={[text.fs_xs, text.color_zinc_400]} weight="medium">
                24H ACTIVTY
              </Text>
            </View>

            <View style={[flex.row, h.h_2, bdr.rounded_full, fx.bg_color_zinc_800, m.mb_3]}>
              <View
                style={[
                  fx.bg_color_green_500,
                  bdr.rounded_l_full,
                  { flex: token.txn.buys }
                ]}
              />
              <View
                style={[
                  fx.bg_color_red_500,
                  bdr.rounded_r_full,
                  { flex: token.txn.sells }
                ]}
              />
            </View>

            {/* Transaction Stats */}
            <View style={[flex.row, justify.between, align.items_center]}>
              <View style={[flex.row, align.items_center, flex.gap_2]}>
                <View style={[w.w_3, h.h_3, bdr.rounded_full, fx.bg_color_green_500]} />
                <Text style={[text.fs_sm, text.color_green_400]} weight="bold">
                  SELL {((token.txn.buys / (token.txn.sells + token.txn.buys)) * 100).toFixed(0)}%
                </Text>
              </View>

              <Text style={[text.fs_sm, text.color_zinc_400]} weight="medium">
                VOL <Text style={[text.fs_sm, text.color_zinc_100]} weight="bold">${formatCryptoNumber(token.tokenomics.volume.twentyFourH)}</Text>
              </Text>

              <View style={[flex.row, align.items_center, flex.gap_2]}>
                <Text style={[text.fs_sm, text.color_red_400]} weight="bold">
                  SELL {((token.txn.sells / (token.txn.sells + token.txn.buys)) * 100).toFixed(0)}%
                </Text>
                <View style={[w.w_3, h.h_3, bdr.rounded_full, fx.bg_color_red_500]} />
              </View>
            </View>

            {/* Transaction Metrics */}
            <View style={[flex.row, justify.between, p.pt_3, bdr.t_1, bdr.color_zinc_700, m.mt_3]}>
              <View style={[align.items_center]}>
                <Text style={[text.fs_xs, text.color_zinc_400, p.pb_1]} weight="medium">
                  BUYS
                </Text>
                <Text style={[text.fs_sm, text.color_green_400]} weight="bold">
                  {token.txn.buys}
                </Text>
              </View>

              <View style={[align.items_center]}>
                <Text style={[text.fs_xs, text.color_zinc_400, p.pb_1]} weight="medium">
                  SELLS
                </Text>
                <Text style={[text.fs_sm, text.color_red_400]} weight="bold">
                  {token.txn.sells}
                </Text>
              </View>

              <View style={[align.items_center]}>
                <Text style={[text.fs_xs, text.color_zinc_400, p.pb_1]} weight="medium">
                  TOTAL TRADES
                </Text>
                <Text style={[text.fs_sm, text.color_zinc_100]} weight="bold">
                  {token.txn.buys + token.txn.buys}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tokenomics Section */}
        <View style={[p.px_3, p.pb_4]}>
          <View style={[flex.row, justify.between, flex.gap_3]}>
            <View style={[flex.f_1, p.p_3, bdr.rounded_lg, bdr.w_1, bdr.color_(BoxColors.blue.secondary), fx.bg_color_(BoxColors.blue.tertiary)]}>
              <Text style={[text.fs_xs, text.color_(BoxColors.blue.secondary), text.align_center, p.pb_1]} weight="medium">
                MARKET CAP
              </Text>
              <Text style={[text.fs_lg, text.color_(BoxColors.blue.primary), text.align_center]} weight="bold">
                ${formatCryptoNumber(token.tokenomics.marketCap)}
              </Text>
            </View>
            <View style={[flex.f_1, p.p_3, bdr.rounded_lg, bdr.w_1, bdr.color_(BoxColors.purple.secondary), fx.bg_color_(BoxColors.purple.tertiary)]}>
              <Text style={[text.fs_xs, text.color_(BoxColors.purple.secondary), text.align_center, p.pb_1]} weight="medium">
                LIQUIDITY
              </Text>
              <Text style={[text.fs_lg, text.color_(BoxColors.purple.primary), text.align_center]} weight="bold">
                ${formatCryptoNumber(token.tokenomics.liquidity)}
              </Text>
            </View>
            <View style={[flex.f_1, p.p_3, bdr.rounded_lg, bdr.w_1, bdr.color_(BoxColors.orange.secondary), fx.bg_color_(BoxColors.orange.tertiary)]}>
              <Text style={[text.fs_xs, text.color_(BoxColors.orange.secondary), text.align_center, p.pb_1]} weight="medium">
                HOLDERS
              </Text>
              <Text style={[text.fs_lg, text.color_(BoxColors.orange.primary), text.align_center]} weight="bold">
                {formatCryptoNumber(token.tokenomics.holder)}
              </Text>
            </View>
          </View>
        </View>

        <View style={[p.px_3, p.pb_6, flex.gap_2, flex.row, justify.around, flex.grow]}>
          <Pressable 
            style={[flex.row, align.items_center, justify.center, p.py_3, p.px_2, bdr.rounded_full, bdr.w_1, bdr.color_yellow_500, flex.gap_2, flex.grow]}
            onPress={() => toggleFavouriteStatus(token.mintadd)}
          >
            <Star size={20} color="#EAB308" fill={token.watchlist ? "#EAB308" : "transparent"} />
            <Text style={[text.fs_xs, text.color_("#EAB308")]} weight="bold">
              Favourites
            </Text>
          </Pressable>
          
          <ExternalLink href={`https://axiom.trade/t/${token.mintadd}/@bscnrapp`}>
            <View style={[ flex.row,align.items_center, justify.center, p.py_3, p.px_6, bdr.rounded_full, bdr.w_1, bdr.color_zinc_500, flex.gap_3]}>
              <ChartCandlestick size={20} color="#ECEDEE" />
              <Text style={[text.fs_xs, text.color_zinc_100]} weight="bold">
                Trade {token.ticker}/SOL
              </Text>
            </View>
          </ExternalLink>
        </View>

        <View style={[p.px_3, p.pb_4]}>
          <Text style={[text.fs_xs, text.color_zinc_500, text.align_center]} weight="medium">
            * Trade with caution. Cryptocurrency investments carry high risk.
          </Text>
        </View>

        {/* Safe Area Bottom Spacing */}
        <View style={{ height: insets.bottom + 110 }} />
      </ScrollView>
  );
};