import React, { ReactNode } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from "../contexts/ThemeContext";

interface NeumorphicOutsetProps {
  children: ReactNode;
  style?: any;
  color?: string;
}

const NeumorphicOutset: React.FC<NeumorphicOutsetProps> = ({ children, style, color }) => {
  const { theme } = useTheme();
  const { padding, alignItems, ...restStyle } = StyleSheet.flatten(style) || {};

  const styles = StyleSheet.create({
    container: {
      borderRadius: theme.borderRadius.m,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.neumorphic.outset.shadow,
          shadowOffset: theme.colors.neumorphic.outset.shadowOffset,
          shadowOpacity: theme.colors.neumorphic.outset.shadowOpacity,
          shadowRadius: theme.colors.neumorphic.outset.shadowRadius,
        },
        android: {
          elevation: theme.colors.neumorphic.outset.elevation,
          backgroundColor: color || theme.colors.background,
        },
      }),
    },
    highlight: {
        borderRadius: theme.borderRadius.m,
        ...Platform.select({
            ios: {
                shadowColor: theme.colors.neumorphic.outset.highlight,
                shadowOffset: theme.colors.neumorphic.outset.highlightOffset,
                shadowOpacity: theme.colors.neumorphic.outset.highlightOpacity,
                shadowRadius: theme.colors.neumorphic.outset.shadowRadius,
            },
        }),
    },
    content: {
      borderRadius: theme.borderRadius.m,
      backgroundColor: color || theme.colors.background,
      padding: padding,
      alignItems: alignItems,
    },
  });

  return (
    <View style={[styles.container, restStyle]}>
        <View style={styles.highlight}>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    </View>
  );
};

export default NeumorphicOutset;