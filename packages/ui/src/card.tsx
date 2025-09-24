import { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "./contexts/ThemeContext";

export function Card({ children }: { children: ReactNode }): JSX.Element {
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

  return <View style={styles.card}>{children}</View>;
}
