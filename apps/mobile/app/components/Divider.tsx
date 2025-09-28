import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@repo/ui';

interface DividerProps {
  style?: ViewStyle;
}

export default function Divider({ style }: DividerProps) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    divider: {
      height: 5,
      backgroundColor: theme.colors.darkenColor,
      borderRadius: theme.borderRadius.s,
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