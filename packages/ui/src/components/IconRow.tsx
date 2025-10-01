/**
 * @file IconRow.tsx
 * @description This file defines a flexible component for displaying a horizontal row of icons.
 * Each item can be a navigable link, a button with an onPress handler, or a static icon with text.
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import * as Icons from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useTheme } from "../contexts/ThemeContext";
import NeumorphicOutset from './NeumorphicOutset';

/**
 * Props for the IconRow component.
 */
interface IconRowProps {
  /** An array of icon objects to be displayed in the row. */
  icons: {
    /** The name of the icon to display from the icon set. */
    name?: string;
    /** A string of text to display within the icon block. */
    text?: string;
    /** A function to be called when the icon is pressed. */
    onPress?: () => void;
    /** A URL to navigate to when the icon is pressed. Uses expo-router's Link. */
    href?: string;
    /** The name of the icon set to use (e.g., 'MaterialCommunityIcons'). Defaults to 'MaterialCommunityIcons'. */
    iconSet?: keyof typeof Icons;
    /** The color of the icon and/or text. */
    color?: string;
    /** The background color of the icon block. */
    backgroundColor?: string;
    /** Custom style for the text. */
    textStyle?: TextStyle;
  }[];
  /** Optional custom style for the main container. */
  style?: ViewStyle;
  /** The border radius for the icon blocks. */
  borderRadius?: number;
}

/**
 * A component that renders a horizontal row of icons, each with optional text and interaction.
 * The icons are styled with a neumorphic outset effect.
 */
export const IconRow = ({ icons, style, borderRadius }: IconRowProps) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      gap: theme.spacing.xs,
    },
    iconBlock: {
      padding: theme.spacing.s + 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    touchable: {
      flex: 1,
    },
  });

  return (
    <View style={[styles.iconContainer, style]}>
      {icons.map((icon, index) => {
        // Dynamically select the icon set, defaulting to MaterialCommunityIcons.
        const Icon = Icons[icon.iconSet || 'MaterialCommunityIcons'];
        
        // The common content for each item in the row (the icon/text block).
        const iconContent = (
          <NeumorphicOutset 
            containerStyle={{
              borderRadius: borderRadius ?? theme.borderRadius.l,
              margin: theme.spacing.s,
            }}
            contentStyle={{
              backgroundColor: icon.backgroundColor || theme.colors.background,
              borderRadius: borderRadius ?? theme.borderRadius.l,
              overflow: 'hidden',
            }}
          >
            <View style={styles.iconBlock}>
                {icon.name && <Icon name={icon.name} size={25} color={icon.color || theme.colors.text} />}
                {icon.text && <Text style={[{color: icon.color || theme.colors.text}, icon.textStyle]}>{icon.text}</Text>}
            </View>
          </NeumorphicOutset>
        );

        // If an href is provided, wrap the icon in a Link component for navigation.
        if (icon.href) {
          return (
            <Link href={icon.href} asChild key={index}>
              <TouchableOpacity style={styles.touchable}>{iconContent}</TouchableOpacity>
            </Link>
          );
        }

        // If an onPress handler is provided, wrap the icon in a TouchableOpacity to make it a button.
        if (icon.onPress) {
            return (
                <TouchableOpacity onPress={icon.onPress} key={index} style={styles.touchable}>
                    {iconContent}
                </TouchableOpacity>
            );
        }

        // If neither href nor onPress is provided, render a static, non-interactive view.
        return (
            <View key={index} style={styles.touchable}>
                {iconContent}
            </View>
        );
      })}
    </View>
  );
};