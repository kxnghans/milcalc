/**
 * @file card.tsx
 * @description This file defines a basic Card component. It's a reusable container
 * that applies a consistent neumorphic outset style to its children.
 */

import { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import NeumorphicOutset from "./NeumorphicOutset";

/**
 * A styled container component that gives its content a "card" like appearance
 * with a neumorphic outset effect.
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The content to be rendered inside the card.
 * @param {ViewStyle} [props.style] - Optional custom styles to be applied to the card's container.
 * @returns {JSX.Element} The rendered Card component.
 */
export function Card({ children, style }: { children: ReactNode, style?: ViewStyle }): JSX.Element {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    cardContent: {
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.m,
      backgroundColor: theme.colors.background,
      overflow: 'hidden', // Ensures the content respects the border radius.
    },
  });

  // The Card is built upon the NeumorphicOutset component to maintain a consistent visual style.
  return (
    <NeumorphicOutset containerStyle={[style, { borderRadius: theme.borderRadius.m }]} contentStyle={styles.cardContent}>
        {children}
    </NeumorphicOutset>
  );
}