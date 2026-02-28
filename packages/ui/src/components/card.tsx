/**
 * @file card.tsx
 * @description This file defines a basic Card component. It's a reusable container
 * that applies a consistent neumorphic outset style to its children.
 */

import React, { ReactNode } from "react";
import { StyleSheet, ViewStyle, StyleProp } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import NeumorphicOutset from "./NeumorphicOutset";

/**
 * A styled container component that gives its content a "card" like appearance
 * with a neumorphic outset effect.
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The content to be rendered inside the card.
 * @param {StyleProp<ViewStyle>} [props.style] - Optional custom styles to be applied to the card's container.
 * @param {StyleProp<ViewStyle>} [props.containerStyle] - Alias for style, for consistency with other components.
 * @returns {React.JSX.Element} The rendered Card component.
 */
export function Card({ children, style, containerStyle }: { children: ReactNode, style?: StyleProp<ViewStyle>, containerStyle?: StyleProp<ViewStyle> }): React.JSX.Element {
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
    <NeumorphicOutset containerStyle={[style, containerStyle, { borderRadius: theme.borderRadius.m }]} contentStyle={styles.cardContent}>
        {children}
    </NeumorphicOutset>
  );
}