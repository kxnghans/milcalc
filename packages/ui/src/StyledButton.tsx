import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from './contexts/ThemeContext';
import * as Icons from '@expo/vector-icons';

interface StyledButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium';
  style?: StyleProp<ViewStyle>;
  icon?: string;
  iconSet?: keyof typeof Icons;
  iconSize?: number;
}

export const StyledButton = ({ title, variant = 'primary', size = 'medium', style, icon, iconSet = 'MaterialCommunityIcons', iconSize, ...props }: StyledButtonProps) => {
  const { theme } = useTheme();
  const Icon = Icons[iconSet];

  const styles = StyleSheet.create({
    button: {
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
    // Sizes
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

  const buttonSizeStyle = size === 'small' ? styles.smallButton : styles.mediumButton;
  const textSizeStyle = size === 'small' ? styles.smallText : styles.mediumText;
  const finalIconSize = iconSize ?? (size === 'small' ? theme.typography.subtitle.fontSize + 2 : theme.typography.body.fontSize + 2);

  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], buttonSizeStyle, style]}
      {...props}
    >
      {icon && Icon && <Icon name={icon} size={finalIconSize} color={styles[`${variant}Text`].color} style={styles.icon} />}
      <Text style={[styles.text, styles[`${variant}Text`], textSizeStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};