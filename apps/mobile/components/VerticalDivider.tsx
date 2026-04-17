import { useTheme } from "@repo/ui";
import React, { useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface VerticalDividerProps {
  style?: ViewStyle;
}

export default function VerticalDivider({ style }: VerticalDividerProps) {
  const { theme } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        divider: {
          width: 5,
          backgroundColor: theme.colors.darkenColor,
          borderRadius: theme.borderRadius.s,
          // The inset effect for a vertical divider
          borderLeftWidth: theme.colors.neumorphic.inset.borderWidth,
          borderRightWidth: theme.colors.neumorphic.inset.borderWidth,
          borderLeftColor: theme.colors.neumorphic.inset.shadow,
          borderRightColor: theme.colors.neumorphic.inset.highlight,
          // Use top and bottom for the shadow/highlight effect on a vertical line
          borderTopColor: theme.colors.neumorphic.inset.shadow,
          borderBottomColor: theme.colors.neumorphic.inset.highlight,
          borderTopWidth: theme.colors.neumorphic.inset.borderWidth,
          borderBottomWidth: theme.colors.neumorphic.inset.borderWidth,
        },
      }),
    [theme],
  );

  return <View style={[styles.divider, style]} />;
}
