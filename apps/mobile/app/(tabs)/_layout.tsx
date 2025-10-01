/**
 * @file _layout.tsx
 * @description This file defines the layout for the main tab navigation of the mobile app.
 * It configures the appearance of the tab bar and defines each tab screen.
 */

import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@repo/ui';

/**
 * The layout component for the main tab navigator.
 * It uses Expo Router's Tabs component to create the tab bar.
 * @returns {JSX.Element} The rendered tab layout.
 */
export default function TabLayout() {
  const { theme, isDarkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        // Apply neumorphic styling to the tab bar.
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: 'transparent', // Hide the default top border.
          // The following shadow properties create the "outset" effect.
          shadowColor: theme.colors.neumorphic.outset.highlight,
          shadowOffset: theme.colors.neumorphic.outset.highlightOffset,
          shadowOpacity: theme.colors.neumorphic.outset.highlightOpacity,
          shadowRadius: theme.colors.neumorphic.outset.shadowRadius,
          elevation: theme.colors.neumorphic.outset.elevation,
        },
        // Apply neumorphic styling to the header.
        headerStyle: {
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.neumorphic.outset.shadow,
          shadowOffset: theme.colors.neumorphic.outset.shadowOffset,
          shadowOpacity: theme.colors.neumorphic.outset.shadowOpacity,
          shadowRadius: theme.colors.neumorphic.outset.shadowRadius,
          elevation: theme.colors.neumorphic.outset.elevation,
        },
        headerTitleStyle: {
          ...theme.typography.header,
          color: theme.colors.text,
        },
        tabBarLabelStyle: {
          ...theme.typography.caption,
        },
        tabBarHideOnKeyboard: true, // Hide the tab bar when the keyboard is open.
      }}>
      {/* The main PT Calculator screen. */}
      <Tabs.Screen
        name="pt-calculator"
        options={{
          headerTitle: 'Air Force PT Calculator',
          tabBarLabel: 'PT Calculator',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="calculator" size={28} color={color} />,
        }}
      />
      {/* The Pay Calculator screen. */}
      <Tabs.Screen
        name="pay-calculator"
        options={{
          title: 'Pay Calculator',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cash-multiple" size={28} color={color} />,
        }}
      />
      {/* The Retirement Calculator screen. */}
      <Tabs.Screen
        name="retirement-calculator"
        options={{
          title: 'Retirement',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="clock-check-outline" size={28} color={color} />,
        }}
      />
      {/* The Best Score screen is part of the tab group for routing purposes but is not visible in the tab bar. */}
      <Tabs.Screen
        name="best-score"
        options={{
          headerTitle: 'Best PT Score Calculator',
          href: null, // `href: null` hides the screen from the tab bar.
        }}
      />
    </Tabs>
  );
}