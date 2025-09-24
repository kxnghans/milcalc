import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle, View } from 'react-native';
import { useTheme } from './contexts/ThemeContext';
import * as Icons from '@expo/vector-icons';

interface StyledButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
  icon?: string;
  iconSet?: keyof typeof Icons;
  iconSize?: number;
}

export const StyledButton = ({ title, variant = 'primary', style, icon, iconSet = 'MaterialCommunityIcons', iconSize = 20, ...props }: StyledButtonProps) => {
  const { theme } = useTheme();
  const Icon = Icons[iconSet];

  const styles = StyleSheet.create({
    button: {
      paddingVertical: theme.spacing.m,
      paddingHorizontal: theme.spacing.l,
      borderRadius: theme.borderRadius.m,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    primary: {
      backgroundColor: theme.colors.primary,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
    },
    text: {
      fontSize: theme.typography.body.fontSize,
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
    }
  });

  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], style]}
      {...props}
    >
      {icon && Icon && <Icon name={icon} size={iconSize} color={styles[`${variant}Text`].color} style={styles.icon} />}
      <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
    </TouchableOpacity>
  );
};
