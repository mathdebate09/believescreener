import { Tabs } from 'expo-router';
import React, { useRef } from 'react';
import { Platform, TouchableOpacity, Animated } from 'react-native';

import { TabColors } from '@/constants/Colors';
import { Search, Star } from 'lucide-react-native';
import TabBarBackground from '@/data/tempcomps/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import Logo from '@/components/svg/Logo';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const spinValue = useRef(new Animated.Value(0)).current;

  const spin = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: TabColors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={1}/>,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Logo 
                color={focused ? '#0da042' : color} 
                size={28}
              />
            </Animated.View>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              activeOpacity={1}
              onPress={() => {
                props.onPress?.();
                spin();
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Search color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({ color }) => <Star color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
