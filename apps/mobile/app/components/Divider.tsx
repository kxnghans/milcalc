/**
 * @file Divider.tsx
 * @description This file defines a styled horizontal divider component with a neumorphic inset effect.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@repo/ui';

/**
 * Props for the Divider component.
 */
interface DividerProps {
  /** Optional custom styles to be applied to the divider. */
  style?: ViewStyle;
}

/**
 * A component that renders a styled horizontal divider with a neumorphic "inset" look.
 * It's used to create visual separation between different UI sections.
 * @param {DividerProps} props - The component props.
 * @returns {JSX.Element} The rendered divider component.
 */
export default function Divider({ style }: DividerProps) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    divider: {
      height: 5,
      backgroundColor: theme.colors.darkenColor,
      borderRadius: theme.borderRadius.s,
      // The inset effect is created by applying different colored borders
      // to the top/left and bottom/right, simulating an inner shadow and highlight.
      borderTopWidth: theme.colors.neumorphic.inset.borderWidth,
      borderLeftWidth: theme.colors.neumorphic.inset.borderWidth,
      borderTopColor: theme.colors.neumorphic.inset.shadow,
      borderLeftColor: theme.colors.neumorphic.inset.shadow,
      borderBottomWidth: theme.colors.neumorphic.inset.borderWidth,
      borderRightWidth: theme.colors.neumorphic.inset.borderWidth,
      borderBottomColor: theme.colors.neumorphic.inset.highlight,
      borderRightColor: theme.colors.neumorphic.inset.highlight,
    },
  });

  return (
    <View style={[styles.divider, style]} />
  );
}