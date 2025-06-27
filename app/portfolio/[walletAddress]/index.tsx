import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, Pressable, ScrollView, Share, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Check, ChevronLeft, Copy } from 'lucide-react-native';
import { align, bdr, flex, fx, h, justify, m, p, text, w, z } from 'nativeflowcss';
import { PieChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { TokenContext } from '@/context/tokenData';
import { NotificationBar } from '@/components/NotificationBar';
import { Text } from '@/components/ui/CustomText';
import { formatCryptoNumber } from '@/utils/formatNumbers';

interface HeliusToken {
  interface: string;
  id: string;
  content: {
    $schema: string;
    json_uri: string;
    files: {
      uri: string;
      cdn_uri: string;
      mime: string;
    }[];
    metadata: {
      description: string;
      name: string;
      symbol: string;
    };
    links: {
      image: string;
    };
  };
  authorities: {
    address: string;
    scopes: string[];
  }[];
  compression: {
    eligible: boolean;
    compressed: boolean;
    data_hash: string;
    creator_hash: string;
    asset_hash: string;
    tree: string;
    seq: number;
    leaf_id: number;
  };
  grouping: any[];
  royalty: {
    royalty_model: string;
    target: string | null;
    percent: number;
    basis_points: number;
    primary_sale_happened: boolean;
    locked: boolean;
  };
  creators: any[];
  ownership: {
    frozen: boolean;
    delegated: boolean;
    delegate: string | null;
    ownership_model: string;
    owner: string;
  };
  supply: number | null;
  mutable: boolean;
  burnt: boolean;
  mint_extensions: {
    metadata: {
      uri: string;
      mint: string;
      name: string;
      symbol: string;
      update_authority: string;
      additional_metadata: any[];
    };
    metadata_pointer: {
      authority: string;
      metadata_address: string;
    };
    transfer_fee_config: {
      withheld_amount: number;
      newer_transfer_fee: {
        epoch: number;
        maximum_fee: number;
        transfer_fee_basis_points: number;
      };
      older_transfer_fee: {
        epoch: number;
        maximum_fee: number;
        transfer_fee_basis_points: number;
      };
      withdraw_withheld_authority: string;
      transfer_fee_config_authority: string;
    };
  };
  token_info: {
    token_accounts: {
      address: string;
      balance: number;
    }[];
    symbol: string;
    balance: number;
    supply: number;
    decimals: number;
    token_program: string;
    associated_token_address: string;
    price_info: {
      price_per_token: number;
      total_price: number;
      currency: string;
    };
  };
}

interface HeliusApiResponse {
  jsonrpc: string;
  result: {
    total: number;
    limit: number;
    page: number;
    items: HeliusToken[];
  };
}

export default function PortfolioDetail() {
  const { walletAddress } = useLocalSearchParams();
  const { tokenList } = useContext(TokenContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<HeliusToken[]>([]);
  const [believeTotal, setBelieveTotal] = useState<number>(0);
  const [walletTotal, setWalletTotal] = useState<number>(0);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [copiedTokens, setCopiedTokens] = useState<Set<string>>(new Set());
  const spinValue = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (loading) {
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();

      return () => spinAnimation.stop();
    }
  }, [loading, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });


  const handleShare = async () => {
    try {
      const shareUrl = `https://solscan.io/account/${walletAddress}`;
      await Share.share({
        message: `Check this wallet on Solscan: ${shareUrl}`,
        url: shareUrl,
        title: `${walletAddress} Wallet`
      });
    } catch {
      Alert.alert('Error', 'Failed to share wallet');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}.....${address.slice(-4)}`;
  };

  const handleCopyAddress = async () => {
    try {
      await Clipboard.setStringAsync(String(walletAddress));
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy address');
    }
  };

  const handleCopyToken = async (tokenId: string) => {
    try {
      await Clipboard.setStringAsync(tokenId);
      setCopiedTokens(prev => new Set(prev).add(tokenId));
      setTimeout(() => {
        setCopiedTokens(prev => {
          const newSet = new Set(prev);
          newSet.delete(tokenId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy token address');
    }
  };

  useEffect(() => {
    fetchPortfolioAssets();
  }, [walletAddress]);

  const fetchPortfolioAssets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${process.env.EXPO_PUBLIC_HELIUS_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "id": "1",
          "method": "getAssetsByOwner",
          "params": {
            "ownerAddress": walletAddress,
            "page": 1,
            "limit": 1000,
            "sortBy": {
              "sortBy": "created",
              "sortDirection": "asc"
            },
            "options": {
              "showUnverifiedCollections": false,
              "showCollectionMetadata": false,
              "showGrandTotal": true,
              "showFungible": true,
              "showNativeBalance": true,
              "showInscription": false,
              "showZeroBalance": false
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: HeliusApiResponse = await response.json();

      // Add debugging logs
      console.log('API Response:', data);
      console.log('Items count:', data.result?.items?.length || 0);

      // Check if data structure is valid
      if (!data.result || !Array.isArray(data.result.items)) {
        console.error('Invalid API response structure:', data);
        setError('Invalid response from API');
        return;
      }

      // Create token map with normalized keys
      const tokenMap = new Map(
        tokenList.map(token => [token.mintadd.trim().toLowerCase(), token])
      );

      console.log('Token map size:', tokenMap.size);

      const filteredItems: HeliusToken[] = data.result.items
        .filter((item: { id: string }) => {
          const normalizedId = item.id.trim().toLowerCase();
          const hasToken = tokenMap.has(normalizedId);
          if (hasToken) console.log('Found matching token:', item.id);
          return hasToken;
        })
        .map((item: HeliusToken) => {
          const matchedToken = tokenMap.get(item.id.trim().toLowerCase());
          return {
            ...item,
            content: {
              ...item.content,
              links: {
                ...item.content.links,
                image: matchedToken?.img.logo || item.content.links.image,
              }
            }
          };
        });

      console.log('Filtered items count:', filteredItems.length);

      const believeTotal = filteredItems.reduce((sum, item) => {
        return sum + (item.token_info?.price_info?.total_price || 0);
      }, 0);

      const walletTotal = data.result.items.reduce((sum: number, item: any) => {
        return sum + (item.token_info?.price_info?.total_price || 0);
      }, 0);

      console.log('Believe total:', believeTotal);
      console.log('Wallet total:', walletTotal);


      setBelieveTotal(believeTotal);
      setWalletTotal(walletTotal);
      setItems(filteredItems);
    } catch (err) {
      setError('Failed to fetch portfolio data');
      console.error('Error fetching portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[flex.f_1, fx.bg_color_(Colors.black), h.h_('100%')]}>
      {/* Header */}
      <View style={[fx.bg_color_(Colors.gray),
      z.index_10]}>
        <NotificationBar />
        <View style={[flex.row, flex.gap_3, align.items_center, justify.between, p.px_3, h.h_20]}>
          <Pressable
            onPress={handleGoBack}
            style={[p.p_2, flex.row, align.items_center, justify.center]}
          >
            <ChevronLeft size={24} color="#ECEDEE" />
          </Pressable>

          <View style={[flex.row, flex.gap_2, flex.f_1, justify.center]}>
            <Text weight={"bold"} style={[text.fs_2xl, text.color_zinc_100]}>
              {formatAddress(String(walletAddress))}
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

      {/* Loading */}
      {loading && (
        <View style={[flex.f_1, align.items_center, justify.center]}>
          <Animated.Image
            source={require('@/assets/images/logos/screener.png')}
            style={[
              w.w_24,
              h.h_24,
              bdr.rounded_full,
              { transform: [{ rotate: spin }] }
            ]}
          />
          <Text style={[text.fs_lg, text.color_zinc_100]}>Loading...</Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={[flex.f_1, align.items_center, justify.center]}>
          <Text style={[text.fs_lg, text.color_red_500]}>{error}</Text>
        </View>
      )}

      {/* Portfolio Content */}
      {!loading && !error && (
        <ScrollView style={[flex.f_1, p.p_4]} showsVerticalScrollIndicator={false}>
          <View style={[flex.row, align.items_center, justify.between, p.p_3, bdr.rounded_lg, fx.bg_color_(Colors.gray), m.mb_4]}>
            <View style={[flex.f_1]}>
              <Text style={[text.fs_sm, text.color_zinc_400]}>Wallet Address</Text>
              <Text style={[text.fs_base, p.pr_4, text.color_zinc_100]}>{walletAddress}</Text>
            </View>
            <Pressable
              onPress={handleCopyAddress}
              style={[p.p_2, flex.row, align.items_center, justify.center]}
            >
              {copiedAddress ? (
                <Check size={20} color="#22c55e" />
              ) : (
                <Copy size={20} color="#ECEDEE" />
              )}
            </Pressable>
          </View>

          {/* Portfolio Pie Chart */}
          <View style={[p.p_4, bdr.rounded_lg, fx.bg_color_(Colors.gray), m.mb_4]}>
            <Text weight="bold" style={[text.fs_xl, text.color_zinc_100, text.text_center, m.mb_4]}>
              Portfolio
            </Text>

            {walletTotal > 0 ? (
              <View style={[align.items_center, flex.row, justify.center]}>
                <PieChart
                  data={[
                    {
                      name: 'Believe Tokens',
                      population: believeTotal,
                      color: Colors.green,
                      legendFontColor: '#ECEDEE',
                      legendFontSize: 14,
                    },
                    {
                      name: 'Other Tokens',
                      population: walletTotal - believeTotal,
                      color: '#6b7280',
                      legendFontColor: '#ECEDEE',
                      legendFontSize: 14,
                    },
                  ]}
                  width={Dimensions.get('window').width - 80}
                  height={220}
                  chartConfig={{
                    backgroundColor: Colors.gray,
                    backgroundGradientFrom: Colors.gray,
                    backgroundGradientTo: Colors.gray,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                  hasLegend={false}
                />

                <View style={[flex.col, justify.between, { marginLeft: -110 }, m.mt_14]}>
                  <View style={[align.items_center]}>
                    <View style={[flex.row, align.items_center, m.mb_1]}>
                      <View style={[w.w_3, h.h_3, bdr.rounded_full, { backgroundColor: Colors.green }, m.mr_2]} />
                      <Text style={[text.fs_sm, text.color_zinc_400]}>Believe Tokens</Text>
                    </View>
                    <Text style={[text.fs_lg, text.color_zinc_100]}>
                      ${formatCryptoNumber(believeTotal)}
                    </Text>
                  </View>

                  <View style={[align.items_center, flex.f_1]}>
                    <View style={[flex.row, align.items_center, m.mb_1]}>
                      <View style={[w.w_3, h.h_3, bdr.rounded_full, { backgroundColor: '#6b7280' }, m.mr_2]} />
                      <Text style={[text.fs_sm, text.color_zinc_400]}>Other Tokens</Text>
                    </View>
                    <Text style={[text.fs_lg, text.color_zinc_100]}>
                      ${formatCryptoNumber(walletTotal - believeTotal)}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <Text style={[text.fs_base, text.color_zinc_400, text.text_center]}>
                No portfolio data available
              </Text>
            )}
          </View>

          {/* Token List */}
          <View style={[p.p_4, bdr.rounded_lg, fx.bg_color_(Colors.gray)]}>
            <Text weight="bold" style={[text.fs_xl, text.color_zinc_100, m.mb_4]}>
              Holdings
            </Text>

            {items.length > 0 ? (
              items.map((item) => {
                const token = tokenList.find(token => token.mintadd === item.id);
                const isTokenCopied = copiedTokens.has(item.id);
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => router.push(`/token/${item.id}`)}
                    style={[flex.row, flex.gap_3, align.items_center, p.p_3, bdr.rounded_lg, fx.bg_color_(Colors.black), m.mb_2]}
                  >
                    <Image
                      source={{ uri: item.content.links.image }}
                      style={[w.w_8, h.h_8, bdr.rounded_2xl]}
                      resizeMode='cover'
                    />
                    <View style={[flex.f_1]}>
                      <Text style={[text.fs_md, text.color_zinc_100]}>{token?.name || item.content.metadata.name}</Text>
                      <Text style={[text.fs_sm, text.color_zinc_400]}>{token?.ticker || item.content.metadata.symbol}</Text>
                      <Text style={[text.fs_sm, text.color_zinc_300]}>
                        ${formatCryptoNumber(item.token_info.price_info.total_price)}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleCopyToken(item.id)}
                      style={[p.p_2, flex.row, align.items_center]}
                    >
                      {isTokenCopied ? (
                        <Check size={20} color="#22c55e" />
                      ) : (
                        <Copy size={20} color="#ECEDEE" />
                      )}
                    </Pressable>
                  </Pressable>
                );
              })
            ) : (
              <Text style={[text.fs_base, text.color_zinc_400, text.text_center]}>
                No matching tokens found in this wallet
              </Text>
            )}
          </View>

          <View style={[p.px_3, p.pb_4]}>
            <Text style={[text.fs_xs, text.color_zinc_500, text.align_center]} weight="medium">
              * Trade with caution. Cryptocurrency investments carry high risk.
            </Text>
          </View>

          {/* Safe Area Bottom Spacing */}
          <View style={{ height: insets.bottom }} />
        </ScrollView>
      )}

    </View>
  );
}