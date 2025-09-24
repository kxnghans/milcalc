import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@repo/ui';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
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
    </Tabs>
  );
}