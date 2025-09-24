import { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "./contexts/ThemeContext";

export function Card({ children, style }: { children: ReactNode, style?: ViewStyle }): JSX.Element {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.m,
      padding: theme.spacing.m,
      backgroundColor: theme.colors.surface,
    },
  });

  return <View style={[styles.card, style]}>{children}</View>;
}
