import { View, FlatList, Pressable, Animated, Image } from "react-native";
import { NotificationBar } from '@/components/NotificationBar';
import { TokenContext } from '@/context/tokenData';
import { TokenListView } from '@/components/TokenListView';
import { align, flex, fx, h, justify, m, p, text, bdr, w } from "nativeflowcss";
import { useContext, useEffect, useRef } from "react";
import { Text } from '@/components/ui/CustomText';
import { Colors } from "@/constants/Colors";
import { router } from 'expo-router';
import Logo from '@/components/svg/Logo';

export default function IndexScreen() {
  const { tokenList } = useContext(TokenContext);
  const spinValue = useRef(new Animated.Value(0)).current;
  
  const watchlistTokens = tokenList.filter(token => token.watchlist === true);
  
  useEffect(() => {
    if (watchlistTokens.length === 0) {
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [spinValue, watchlistTokens.length]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const handleNavigateToIndex = () => {
    router.push('/(tabs)/' as any);
  };
  
  return (
    <View style={[flex.f_1, fx.bg_color_(Colors.black)]}>
      <View style={[fx.bg_color_(Colors.gray), align.items_center]}>
          <NotificationBar />
          <View style={[h.h_20, justify.center, align.items_center]}>
            <Text style={[text.fs_2xl, text.fw_bold,text.color_zinc_100]}>Favourites</Text>
          </View>
      </View>
      
      {watchlistTokens.length === 0 ? (
        <View style={[flex.f_1, flex.center, flex.gap_4, align.items_center, p.py_4]}>
          <Text style={[text.color_zinc_500, text.fs_lg]}>
            No tokens fed to Believe Catto
          </Text>
          <Image 
            source={require('@/assets/images/catto-hungry.png')}
            style={[w.w_32, h.h_32]}
            resizeMode="contain"
          />
          <Pressable 
            onPress={handleNavigateToIndex}
            style={[p.px_3, p.py_2, w.w_40, bdr.rounded_lg, flex.row, flex.gap_2, align.items_center, bdr.color_("#0da042"), bdr.w_1]}
          >
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Logo color="#0da042" size={24} />
            </Animated.View>
            <Text style={[text.color_green_600, text.fs_base]}>Browse Tokens</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={watchlistTokens}
          renderItem={TokenListView}
          keyExtractor={(item) => item.mintadd}
          style={[flex.f_1]}
        />
      )}
    </View>
  );
}