/**
 * @file retirement-calculator.tsx
 * @description This file defines the placeholder screen for the Retirement Calculator feature.
 * It currently only displays a title and is intended for future development.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@repo/ui';

/**
 * A placeholder component for the Retirement Calculator screen.
 * @returns {JSX.Element} The rendered placeholder screen.
 */
export default function RetirementCalculator() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    text: {
      ...theme.typography.header,
      color: theme.colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Retirement Calculator</Text>
    </View>
  );
}