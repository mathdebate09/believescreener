import { View } from "react-native";
import Constants from "expo-constants";

export function NotificationBar() {
  return (
    <View
      style={{
        height: Constants.statusBarHeight,
        backgroundColor: 'transparent'
      }}
    />
  );
}