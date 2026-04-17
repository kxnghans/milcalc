/**
 * @file NeumorphicOutset.tsx
 * @description This file defines a component that creates a "raised" or "outset" neumorphic effect.
 * It achieves this by using two overlapping shadows: a dark shadow for the bottom/right and a light highlight for the top/left.
 */

import React, { ReactNode } from "react";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { useTheme } from "../contexts/ThemeContext";

/**
 * Props for the NeumorphicOutset component.
 */
interface NeumorphicOutsetProps {
  /** The content to be rendered inside the neumorphic container. */
  children: ReactNode;
  /** @deprecated Use containerStyle or contentStyle instead for better clarity. */
  style?: StyleProp<ViewStyle>;
  /** Style for the outer container that holds both shadows. Use for layout (margins, etc.). */
  containerStyle?: StyleProp<ViewStyle>;
  /** Style for the inner content view. Use for padding, background color, etc. */
  contentStyle?: StyleProp<ViewStyle>;
  /** Style for the highlight shadow view. */
  highlightStyle?: StyleProp<ViewStyle>;
  /** Color of the main (dark) shadow. */
  shadowColor?: string;
  /** Offset of the main (dark) shadow. */
  shadowOffset?: { width: number; height: number };
  /** Opacity of the main (dark) shadow. */
  shadowOpacity?: number;
  /** Radius of the main (dark) shadow. */
  shadowRadius?: number;
  /** Elevation for the shadow on Android. */
  elevation?: number;
  /** Color of the highlight shadow. */
  highlightColor?: string;
  /** Offset of the highlight shadow. */
  highlightOffset?: { width: number; height: number };
  /** Opacity of the highlight shadow. */
  highlightOpacity?: number;
  /** Radius of the highlight shadow. */
  highlightRadius?: number;
}

/**
 * A component that wraps its children in a container with a "raised" or "outset"
 * neumorphic visual effect, characterized by a top-left highlight and a bottom-right shadow.
 */
const NeumorphicOutset: React.FC<NeumorphicOutsetProps> = ({
  children,
  style,
  containerStyle,
  contentStyle,
  highlightStyle,
  shadowColor,
  shadowOffset,
  shadowOpacity,
  shadowRadius,
  elevation,
  highlightColor,
  highlightOffset,
  highlightOpacity,
  highlightRadius,
}) => {
  const { theme } = useTheme();

  // Safely extract all border radius properties
  const getBorderRadii = () => {
    // Flatten styles to reliably get the values
    const flattenedContainerStyle = StyleSheet.flatten(
      containerStyle || {},
    ) as ViewStyle;
    const flattenedContentStyle = StyleSheet.flatten(
      contentStyle || {},
    ) as ViewStyle;
    const flattenedStyle = StyleSheet.flatten(style || {}) as ViewStyle;

    // If a general borderRadius is defined, use it as the base, but allow specific corners to override it
    // if they are explicitly defined in a higher-priority style.
    // However, if borderRadius is defined in Content, and TopLeft is in Container, Content's borderRadius should probably win for all corners?
    // Let's stick to the cascade: explicit property wins.

    // Actually, simple fallback logic:
    // 1. Start with theme default.
    // 2. Override with 'style' prop values (borderRadius sets all, specific sets specific).
    // 3. Override with 'containerStyle'.
    // 4. Override with 'contentStyle'.
    // This mimics how we want the outer shadow (Android container) to match the inner content.

    const baseRadii: {
      borderRadius: number;
      borderTopLeftRadius?: number;
      borderTopRightRadius?: number;
      borderBottomLeftRadius?: number;
      borderBottomRightRadius?: number;
    } = {
      borderRadius: theme.borderRadius.m,
      borderTopLeftRadius: undefined,
      borderTopRightRadius: undefined,
      borderBottomLeftRadius: undefined,
      borderBottomRightRadius: undefined,
    };

    // Merge in order of precedence (lowest to highest) to build the final shape
    const mergeStyle = (source: ViewStyle) => {
      if (source.borderRadius !== undefined) {
        baseRadii.borderRadius = source.borderRadius as number;
        // When borderRadius is set, it resets specific corners in standard CSS/RN behavior IF they aren't explicitly re-declared.
        // But here we just update the base.
        baseRadii.borderTopLeftRadius = undefined;
        baseRadii.borderTopRightRadius = undefined;
        baseRadii.borderBottomLeftRadius = undefined;
        baseRadii.borderBottomRightRadius = undefined;
      }
      if (source.borderTopLeftRadius !== undefined)
        baseRadii.borderTopLeftRadius = source.borderTopLeftRadius as number;
      if (source.borderTopRightRadius !== undefined)
        baseRadii.borderTopRightRadius = source.borderTopRightRadius as number;
      if (source.borderBottomLeftRadius !== undefined)
        baseRadii.borderBottomLeftRadius =
          source.borderBottomLeftRadius as number;
      if (source.borderBottomRightRadius !== undefined)
        baseRadii.borderBottomRightRadius =
          source.borderBottomRightRadius as number;
    };

    mergeStyle(flattenedStyle);
    mergeStyle(flattenedContainerStyle);
    mergeStyle(flattenedContentStyle);

    return baseRadii;
  };

  const {
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
  } = getBorderRadii();

  const styles = StyleSheet.create({
    // The outer container applies the main (dark) shadow and handles Android elevation.
    container: {
      marginTop: theme.spacing.s,
      marginBottom: theme.spacing.s,
      marginLeft: theme.spacing.s,
      marginRight: theme.spacing.s,
      ...Platform.select({
        ios: {
          shadowColor: shadowColor || theme.colors.neumorphic.outset.shadow,
          shadowOffset:
            shadowOffset || theme.colors.neumorphic.outset.shadowOffset,
          shadowOpacity:
            shadowOpacity || theme.colors.neumorphic.outset.shadowOpacity,
          shadowRadius:
            shadowRadius || theme.colors.neumorphic.outset.shadowRadius,
        },
        android: {
          // On Android, a single elevation value is used to create the shadow.
          // Elevation REQUIRES a background color to work.
          elevation: elevation || theme.colors.neumorphic.outset.elevation,
          backgroundColor: theme.colors.background,
          borderRadius,
          borderTopLeftRadius,
          borderTopRightRadius,
          borderBottomLeftRadius,
          borderBottomRightRadius,
        },
      }),
    },
    // A nested view to apply the highlight shadow (light color, opposite offset).
    // This is only applied on iOS, as Android's elevation doesn't support multiple shadows.
    highlight: {
      ...Platform.select({
        ios: {
          shadowColor:
            highlightColor || theme.colors.neumorphic.outset.highlight,
          shadowOffset:
            highlightOffset || theme.colors.neumorphic.outset.highlightOffset,
          shadowOpacity:
            highlightOpacity || theme.colors.neumorphic.outset.highlightOpacity,
          shadowRadius:
            highlightRadius ||
            shadowRadius ||
            theme.colors.neumorphic.outset.shadowRadius,
        },
      }),
    },
    // The view that holds the actual content.
    content: {},
  });

  return (
    // The views are nested to create the two-part shadow effect.
    // Outer view -> dark shadow
    // Middle view -> light highlight
    // Inner view -> content
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.highlight, highlightStyle]}>
        <View style={[styles.content, style, contentStyle]}>{children}</View>
      </View>
    </View>
  );
};

export default NeumorphicOutset;
