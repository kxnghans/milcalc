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
  highlightStyle?: ViewStyle;
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
  highlightColor?: string;
  highlightOffset?: { width: number; height: number };
  highlightOpacity?: number;
  highlightRadius?: number;
}

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

  const styles = StyleSheet.create({
    container: {
      ...Platform.select({
        ios: {
          shadowColor: shadowColor || theme.colors.neumorphic.outset.shadow,
          shadowOffset: shadowOffset || theme.colors.neumorphic.outset.shadowOffset,
          shadowOpacity: shadowOpacity || theme.colors.neumorphic.outset.shadowOpacity,
          shadowRadius: shadowRadius || theme.colors.neumorphic.outset.shadowRadius,
        },
        android: {
          elevation: elevation || theme.colors.neumorphic.outset.elevation,
        },
      }),
    },
    highlight: {
        ...Platform.select({
            ios: {
                shadowColor: highlightColor || theme.colors.neumorphic.outset.highlight,
                shadowOffset: highlightOffset || theme.colors.neumorphic.outset.highlightOffset,
                shadowOpacity: highlightOpacity || theme.colors.neumorphic.outset.highlightOpacity,
                shadowRadius: highlightRadius || shadowRadius || theme.colors.neumorphic.outset.shadowRadius,
            },
        }),
    },
    content: {
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
        <View style={[styles.highlight, highlightStyle]}>
            <View style={[styles.content, style, contentStyle]}>
                {children}
            </View>
        </View>
    </View>
  );
};

export default NeumorphicOutset;