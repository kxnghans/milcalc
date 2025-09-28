import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@repo/ui';

export default function Divider() {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    divider: {
      height: 5,
      marginTop: theme.spacing.m,
      marginBottom: theme.spacing.s,
      backgroundColor: theme.colors.darkenColor,
      borderRadius: theme.borderRadius.m,
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
    <View style={styles.divider} />
  );
}