import { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import NeumorphicOutset from "./NeumorphicOutset";

export function Card({ children, style }: { children: ReactNode, style?: ViewStyle }): JSX.Element {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    cardContent: {
      padding: theme.spacing.m,
    },
  });

  return (
    <NeumorphicOutset containerStyle={style} contentStyle={styles.cardContent}>
        {children}
    </NeumorphicOutset>
  );
}