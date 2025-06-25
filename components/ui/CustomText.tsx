import { Text as NativeText, TextStyle } from 'react-native';
import { useFonts } from 'expo-font';
import { PropsWithChildren } from 'react';

interface CustomTextProps {
  style?: TextStyle | TextStyle[] | any[];
  weight?: 'ultralight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black';
}

export const Text = ({ children, style, weight = 'regular' }: PropsWithChildren<CustomTextProps>) => {
  const [fontsLoaded] = useFonts({
    'SFPro-UltraLight': require('@/assets/fonts/SFpro/SF-Pro-Display-Ultralight.ttf'),
    'SFPro-Thin': require('@/assets/fonts/SFpro/SF-Pro-Display-Thin.ttf'),
    'SFPro-Light': require('@/assets/fonts/SFpro/SF-Pro-Display-Light.ttf'),
    'SFPro-Regular': require('@/assets/fonts/SFpro/SF-Pro-Display-Regular.ttf'),
    'SFPro-Medium': require('@/assets/fonts/SFpro/SF-Pro-Display-Medium.ttf'),
    'SFPro-Semibold': require('@/assets/fonts/SFpro/SF-Pro-Display-Semibold.ttf'),
    'SFPro-Bold': require('@/assets/fonts/SFpro/SF-Pro-Display-Bold.ttf'),
    'SFPro-Heavy': require('@/assets/fonts/SFpro/SF-Pro-Display-Heavy.ttf'),
    'SFPro-Black': require('@/assets/fonts/SFpro/SF-Pro-Display-Black.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const fontWeightMap = {
    'ultralight': 'SFPro-UltraLight',
    'thin': 'SFPro-Thin',
    'light': 'SFPro-Light',
    'regular': 'SFPro-Regular',
    'medium': 'SFPro-Medium',
    'semibold': 'SFPro-Semibold',
    'bold': 'SFPro-Bold',
    'heavy': 'SFPro-Heavy',
    'black': 'SFPro-Black',
  };

  return (
    <NativeText 
      style={[
        { fontFamily: fontWeightMap[weight] }, 
        ...(Array.isArray(style) ? style : [style])
      ]} 
    >
      {children}
    </NativeText>
  );
};