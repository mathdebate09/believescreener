import { View } from "react-native";
import Constants from "expo-constants";

interface NotificationBarProps {
  color?: string;
}

export function NotificationBar({ color = 'transparent' }: NotificationBarProps) {
  return (
    <View
      style={{
        height: Constants.statusBarHeight,
        backgroundColor: color
      }}
    />
  );
}