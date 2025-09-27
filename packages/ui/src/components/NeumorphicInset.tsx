import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface NeumorphicInsetProps {
  children: ReactNode;
  style?: any;
}

const NeumorphicInset: React.FC<NeumorphicInsetProps> = ({ children, style }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.m,
    },
    inner: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.m,
      borderTopWidth: theme.colors.neumorphic.inset.borderWidth,
      borderLeftWidth: theme.colors.neumorphic.inset.borderWidth,
      borderTopColor: theme.colors.neumorphic.inset.shadow,
      borderLeftColor: theme.colors.neumorphic.inset.shadow,
      borderBottomWidth: theme.colors.neumorphic.inset.borderWidth,
      borderRightWidth: theme.colors.neumorphic.inset.borderWidth,
      borderBottomColor: theme.colors.neumorphic.inset.highlight,
      borderRightColor: theme.colors.neumorphic.inset.highlight,
    },
    content: {
      padding: theme.spacing.m,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inner}>
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
};

export default NeumorphicInset;