import React, { ReactNode } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@repo/ui';

interface NeumorphicOutsetProps {
  children: ReactNode;
  style?: any;
}

const NeumorphicOutset: React.FC<NeumorphicOutsetProps> = ({ children, style }) => {
  const { theme } = useTheme();

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
          backgroundColor: theme.colors.background,
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
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.m,
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <View style={[styles.container, style]}>
        <View style={styles.highlight}>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    </View>
  );
};

export default NeumorphicOutset;