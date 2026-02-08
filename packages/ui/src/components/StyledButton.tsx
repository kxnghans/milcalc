/**
 * @file StyledButton.tsx
 * @description This file defines a custom, themeable button component with neumorphic styling.
 * It supports different visual variants, sizes, and optional icons.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from "../contexts/ThemeContext";
import * as Icons from '@expo/vector-icons';
import NeumorphicOutset from './NeumorphicOutset';

/**
 * Props for the StyledButton component.
 */
interface StyledButtonProps extends TouchableOpacityProps {
  /** The text to display on the button. */
  title: string;
  /** The visual style of the button. 'primary' is a solid, raised button, 'secondary' is a less prominent button. */
  variant?: 'primary' | 'secondary';
  /** The size of the button, affecting padding and font size. */
  size?: 'small' | 'medium';
  /** Custom style for the button's outer container. */
  style?: StyleProp<ViewStyle>;
  /** Custom style for the button's text. */
  textStyle?: StyleProp<TextStyle>;
  /** The name of the icon to display on the button. */
  icon?: string;
  /** The icon set to use for the icon (e.g., 'MaterialCommunityIcons'). */
  iconSet?: keyof typeof Icons;
  /** The size of the icon. */
  iconSize?: number;
  /** The opacity of the highlight shadow for the neumorphic effect. */
  highlightOpacity?: number;
}

/**
 * A custom button component that applies neumorphic styling based on the application's theme.
 * It can be configured with different variants, sizes, and an optional leading icon.
 */
export const StyledButton = ({ title, variant = 'primary', size = 'medium', style, textStyle, icon, iconSet = 'MaterialCommunityIcons', iconSize, highlightOpacity: _highlightOpacity, ...props }: StyledButtonProps) => {
  const { theme, isDarkMode } = useTheme();
  const Icon = Icons[iconSet];

  const styles = StyleSheet.create({
    button: {
      paddingHorizontal: theme.spacing.l,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    text: {
      fontWeight: '600',
    },
    primaryText: {
      color: theme.colors.primaryText,
    },
    secondaryText: {
      color: theme.colors.primary,
    },
    icon: {
      marginRight: theme.spacing.s,
    },
    // Size-specific styles
    mediumButton: {
      paddingVertical: theme.spacing.m,
    },
    smallButton: {
      paddingVertical: theme.spacing.s + 4,
    },
    mediumText: {
      fontSize: theme.typography.body.fontSize,
    },
    smallText: {
      fontSize: theme.typography.subtitle.fontSize,
    },
  });

  // Determine styles based on props
  const buttonSizeStyle = size === 'small' ? styles.smallButton : styles.mediumButton;
  const textSizeStyle = size === 'small' ? styles.smallText : styles.mediumText;
  const finalIconSize = iconSize ?? (size === 'small' ? theme.typography.subtitle.fontSize + 2 : theme.typography.body.fontSize + 2);
  const backgroundColor = variant === 'primary' ? theme.colors.primary : theme.colors.secondary;

  const isPrimary = variant === 'primary';

  // Flatten style to extract border radius overrides
  const flattenedStyle = StyleSheet.flatten(style || {});
  const { 
      borderRadius, 
      borderTopLeftRadius, 
      borderTopRightRadius, 
      borderBottomLeftRadius, 
      borderBottomRightRadius 
  } = flattenedStyle;

  const radiusStyles = {
      borderRadius: borderRadius !== undefined ? borderRadius : theme.borderRadius.m,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
  };

  return (
    // The button is wrapped in a NeumorphicOutset to give it the raised 3D effect.
    // The shadow and highlight properties are adjusted based on the variant to create the desired look.
    <NeumorphicOutset 
      // Ensure 'style' (overrides) comes AFTER the default, so custom radii take precedence.
      containerStyle={[{ borderRadius: theme.borderRadius.m }, style]}
      contentStyle={{
        backgroundColor,
        overflow: 'hidden',
        // Apply the extracted or default radius styles to the inner content
        ...radiusStyles
      }}
      // Shadow and highlight properties are tweaked for primary vs. secondary variants and light vs. dark mode.
      shadowOpacity={isPrimary ? (isDarkMode ? undefined : 0.3) : undefined}
      highlightColor={isPrimary ? undefined : (isDarkMode ? 'rgba(0,0,0,1)' : undefined)}
      highlightOpacity={isPrimary ? (isDarkMode ? 0.3 : 1) : (isDarkMode ? 0.01 : 1)}
    >
        <TouchableOpacity
        style={[styles.button, buttonSizeStyle]}
        {...props}
        >
            {/* Render the icon if one is provided. */}
            {icon && Icon && <Icon name={icon} size={finalIconSize} color={styles[`${variant}Text`].color} style={styles.icon} />}
            <Text style={[styles.text, styles[`${variant}Text`], textSizeStyle, textStyle]}>{title}</Text>
        </TouchableOpacity>
    </NeumorphicOutset>
  );
};