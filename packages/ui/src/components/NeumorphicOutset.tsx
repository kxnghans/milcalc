import React, { ReactNode } from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { useTheme } from "../contexts/ThemeContext";

interface NeumorphicOutsetProps {
  children: ReactNode;
  /**
   * @deprecated Use containerStyle or contentStyle instead.
   */
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  color?: string;
}

const NeumorphicOutset: React.FC<NeumorphicOutsetProps> = ({
  children,
  style,
  containerStyle,
  contentStyle,
  color,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      borderRadius: theme.borderRadius.m,
      margin: theme.spacing.s,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.neumorphic.outset.shadow,
          shadowOffset: theme.colors.neumorphic.outset.shadowOffset,
          shadowOpacity: theme.colors.neumorphic.outset.shadowOpacity,
          shadowRadius: theme.colors.neumorphic.outset.shadowRadius,
        },
        android: {
          elevation: theme.colors.neumorphic.outset.elevation,
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
      overflow: 'hidden',
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
        <View style={styles.highlight}>
            <View style={[styles.content, style, contentStyle]}>
                {children}
            </View>
        </View>
    </View>
  );
};

export default NeumorphicOutset;