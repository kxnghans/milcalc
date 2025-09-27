import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface NeumorphicInsetProps {
  children: ReactNode;
  style?: ViewStyle;
}

const NeumorphicInset: React.FC<NeumorphicInsetProps> = ({ children, style }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      borderTopWidth: theme.colors.neumorphic.inset.borderWidth,
      borderLeftWidth: theme.colors.neumorphic.inset.borderWidth,
      borderTopColor: theme.colors.neumorphic.inset.shadow,
      borderLeftColor: theme.colors.neumorphic.inset.shadow,
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