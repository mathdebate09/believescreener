import { View, Text, ViewStyle, TextInput, Pressable, Alert, ScrollView, FlatList } from "react-native";
import { NotificationBar } from '@/components/NotificationBar';
import { TokenContext, TokenType } from '@/context/tokenData';
import { router } from 'expo-router';
import { flex, m, text, p, bdr, fx, w, h, align, justify } from "nativeflowcss";
import { useContext, useState, useMemo } from "react";
import { Colors } from '@/constants/Colors';
import { Search, Wallet, Coins } from 'lucide-react-native';
import { TokenListView } from '@/components/TokenListView';
import { sortTokenList } from "@/utils/sortTokenList";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function IndexScreen() {
  const { tokenList } = useContext(TokenContext);
  const [searchType, setSearchType] = useState<'wallet' | 'token'>('wallet');
  const [searchQuery, setSearchQuery] = useState('');
    const insets = useSafeAreaInsets();

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    if (searchType !== 'token' || !searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.trim().toLowerCase();
    return tokenList.filter(token =>
      token.name.toLowerCase().includes(query) ||
      token.ticker.toLowerCase().includes(query) ||
      token.mintadd.toLowerCase().includes(query)
    );
  }, [searchQuery, searchType, tokenList]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }

    if (searchType === 'wallet') {
      // Direct route to portfolio with wallet address
      router.push(`/portfolio/${searchQuery.trim()}`);
      setSearchQuery('');
    } else {
      // For token search, we'll show the filtered results below
      // Individual token navigation is handled by TokenListView
      if (filteredTokens.length === 0) {
        Alert.alert('Not Found', 'No Believe tokens found matching your search');
      }
    }
  };

  const toggleSearchType = () => {
    setSearchType(prev => prev === 'wallet' ? 'token' : 'wallet');
    setSearchQuery(''); // Clear search when toggling
  };

  return (
    <View style={[flex.f_1 as ViewStyle, fx.bg_color_(Colors.black)]}>
      <NotificationBar />

      <ScrollView style={[flex.f_1]} showsVerticalScrollIndicator={false}>
        <View style={[m.m_4]}>

          {/* Search Container */}
          <View style={[
            flex.row,
            align.items_center,
            bdr.rounded_lg,
            fx.bg_color_(Colors.gray),
            p.p_2
          ]}>

            {/* Toggle Button */}
            <Pressable
              onPress={toggleSearchType}
              style={[
                flex.row,
                align.items_center,
                justify.center,
                p.px_3,
                p.py_2,
                bdr.rounded_md,
                fx.bg_color_(Colors.green),
                m.mr_2
              ]}
            >
              {searchType === 'wallet' ? (
                <Wallet size={20} color="#FFFFFF" />
              ) : (
                <Coins size={20} color="#FFFFFF" />
              )}
              <Text style={[text.fs_sm, text.color_zinc_100, m.ml_2, text.fw_medium]}>
                {searchType === 'wallet' ? 'Wallet' : 'Token'}
              </Text>
            </Pressable>

            {/* Search Input */}
            <TextInput
              style={[
                flex.f_1,
                p.px_3,
                p.py_2,
                text.fs_base,
                text.color_zinc_100,
                fx.bg_color_('transparent')
              ]}
              placeholder={
                searchType === 'wallet'
                  ? 'Enter wallet address'
                  : 'Enter token'
              }
              placeholderTextColor="#6b7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Search Button */}
            <Pressable
              onPress={handleSearch}
              style={[
                p.p_2,
                bdr.rounded_md,
                fx.bg_color_(Colors.green),
                align.items_center,
                justify.center
              ]}
            >
              <Search size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Search Type Description */}
          <Text style={[text.fs_sm, text.color_zinc_400, m.mt_3, m.ml_1]}>
            {searchType === 'wallet'
              ? 'Enter a Solana wallet address to view its portfolio'
              : 'Search for Believe tokens by name, symbol, or mint address'
            }
          </Text>

          {/* Token Search Results */}
          {searchType === 'token' && searchQuery.trim() && (
            <View style={[m.mt_6]}>
              <Text style={[text.fs_lg, text.fw_semibold, text.color_zinc_100]}>
                Search Results ({filteredTokens.length})
              </Text>

              {filteredTokens.length > 0 ? (
                <FlatList
                  data={filteredTokens}
                  renderItem={TokenListView}
                  keyExtractor={(item: TokenType) => item.mintadd}
                  style={[flex.f_1]}
                  scrollEnabled={false}
                />
              ) : (
                <View style={[
                  p.p_6,
                  bdr.rounded_lg,
                  fx.bg_color_(Colors.gray),
                  align.items_center
                ]}>
                  <Coins size={48} color="#6b7280" />
                  <Text style={[text.fs_base, text.color_zinc_400, m.mt_3]}>
                    No Believe tokens found matching &quot;{searchQuery}&quot;
                  </Text>
                  <Text style={[text.fs_sm, text.color_zinc_500, m.mt_2]}>
                    Try searching with a different name, symbol, or mint address
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Quick Actions - Only show when not searching tokens */}
          {!(searchType === 'token' && searchQuery.trim()) && (
            <View style={[m.mt_8]}>
              <Text style={[text.fs_lg, text.fw_semibold, text.color_zinc_100, m.mb_4]}>
                Quick Actions
              </Text>

              <Pressable
                onPress={() => {
                  setSearchType('token');
                  setSearchQuery('');
                }}
                style={[
                  flex.row,
                  align.items_center,
                  p.p_4,
                  bdr.rounded_lg,
                  fx.bg_color_(Colors.gray),
                  m.mb_3
                ]}
              >
                <Coins size={24} color={Colors.green} />
                <View style={[m.ml_3]}>
                  <Text style={[text.fs_base, text.color_zinc_100, text.fw_medium]}>
                    Search Believe Tokens
                  </Text>
                  <Text style={[text.fs_sm, text.color_zinc_400]}>
                    Find tokens by name, symbol, or mint address
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  setSearchType('wallet');
                  setSearchQuery('');
                }}
                style={[
                  flex.row,
                  align.items_center,
                  p.p_4,
                  bdr.rounded_lg,
                  fx.bg_color_(Colors.gray)
                ]}
              >
                <Wallet size={24} color={Colors.green} />
                <View style={[m.ml_3]}>
                  <Text style={[text.fs_base, text.color_zinc_100, text.fw_medium]}>
                    Analyze Wallet
                  </Text>
                  <Text style={[text.fs_sm, text.color_zinc_400, p.pr_2]}>
                    View portfolio breakdown and Believe token holdings
                  </Text>
                </View>
              </Pressable>
            </View>
          )}
        </View>
        <View style={[p.px_3, p.pb_4]}>
          <Text style={[text.fs_xs, text.color_zinc_500, text.align_center]} weight="medium">
            * Trade with caution. Cryptocurrency investments carry high risk.
          </Text>
        </View>

        {/* Safe Area Bottom Spacing */}
        <View style={{ height: insets.bottom + 110 }} />
      </ScrollView>
    </View>
  );
}