import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, NeumorphicOutset } from '@repo/ui';

export default function TabLayout() {
  const { theme, isDarkMode } = useTheme();
  const borderColor = isDarkMode ? theme.colors.secondary : theme.colors.border;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: borderColor,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTitleStyle: {
          ...theme.typography.header,
          color: theme.colors.text,
        },
        tabBarLabelStyle: {
          ...theme.typography.caption,
        },
        tabBarHideOnKeyboard: true,
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
            <NeumorphicOutset
              containerStyle={{
                position: 'absolute',
                top: -1,
                left: 0,
                right: 0,
                height: 1,
              }}
            >
              <View style={{ height: '100%', backgroundColor: borderColor }} />
            </NeumorphicOutset>
          </View>
        ),
      }}>
      <Tabs.Screen
        name="pt-calculator"
        options={{
          headerTitle: 'Air Force PT Calculator',
          tabBarLabel: 'PT Calculator',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="calculator" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pay-calculator"
        options={{
          title: 'Pay Calculator',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cash-multiple" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="retirement-calculator"
        options={{
          title: 'Retirement',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="clock-check-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="best-score"
        options={{
          headerTitle: 'Best PT Score Calculator',
          href: null,
        }}
      />
    </Tabs>
  );
}