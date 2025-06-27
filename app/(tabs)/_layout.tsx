import React, { useRef } from 'react';
import { Animated, Platform, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { Search, Star } from 'lucide-react-native';

import { Colors, TabColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import TabBarBackground from '@/components/ui/TabBarBackground';
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
        tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={1} />,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: Colors.gray,
            paddingBottom: 0,
          },
          default: {
            backgroundColor: Colors.gray,
            paddingTop: 12,
          },
        }),
        tabBarShowLabel: false,
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ focused, color }) => (
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Logo
                color={focused ? '#0da042' : color}
                size={36}
              />
            </Animated.View>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              activeOpacity={1}
              onPress={(e) => {
                props.onPress?.(e);
                spin();
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Search color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Star color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}
