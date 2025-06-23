import {View, Text, ViewStyle} from "react-native";
import { NotificationBar } from '@/components/NotificationBar';
import { TokenContext } from '@/context/tokenData';

import { flex, m, text } from "nativeflowcss";
import { useContext } from "react";

export default function IndexScreen() {
  const { tokenList } = useContext(TokenContext);

  return (
    <View style={[flex.f_1 as ViewStyle]}>
      <NotificationBar />
      <Text style={[text.fs_2xl, text.fw_bold, m.m_4, text.color_zinc_100]}>
        Index
      </Text>
    </View>
  );
}