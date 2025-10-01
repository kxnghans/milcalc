/**
 * @file NeumorphicInset.tsx
 * @description This file defines a component that creates a "pressed-in" or "inset" neumorphic effect.
 * It achieves this by using different colored borders on the top/left and bottom/right sides
 * to simulate an inner shadow and highlight.
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Props for the NeumorphicInset component.
 */
interface NeumorphicInsetProps {
  /** The content to be rendered inside the inset container. */
  children: ReactNode;
  /** Optional custom styles to be applied to the container. */
  style?: ViewStyle;
}

/**
 * A component that wraps its children in a container with a "pressed-in" or "inset"
 * neumorphic visual effect.
 */
const NeumorphicInset: React.FC<NeumorphicInsetProps> = ({ children, style }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      // The top and left borders are given a darker color to simulate an inner shadow.
      borderTopWidth: theme.colors.neumorphic.inset.borderWidth,
      borderLeftWidth: theme.colors.neumorphic.inset.borderWidth,
      borderTopColor: theme.colors.neumorphic.inset.shadow,
      borderLeftColor: theme.colors.neumorphic.inset.shadow,
      // The bottom and right borders are given a lighter color to simulate an inner highlight.
      borderBottomWidth: theme.colors.neumorphic.inset.borderWidth,
      borderRightWidth: theme.colors.neumorphic.inset.borderWidth,
      borderBottomColor: theme.colors.neumorphic.inset.highlight,
      borderRightColor: theme.colors.neumorphic.inset.highlight,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

export default NeumorphicInset;