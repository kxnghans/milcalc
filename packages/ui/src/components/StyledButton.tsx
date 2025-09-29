import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from "../contexts/ThemeContext";
import * as Icons from '@expo/vector-icons';
import NeumorphicOutset from './NeumorphicOutset';

interface StyledButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium';
  style?: StyleProp<ViewStyle>;
  icon?: string;
  iconSet?: keyof typeof Icons;
  iconSize?: number;
  highlightOpacity?: number;
}

export const StyledButton = ({ title, variant = 'primary', size = 'medium', style, icon, iconSet = 'MaterialCommunityIcons', iconSize, highlightOpacity, ...props }: StyledButtonProps) => {
  const { theme } = useTheme();
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
  const backgroundColor = variant === 'primary' ? theme.colors.primary : theme.colors.secondary;

  return (
    <NeumorphicOutset 
      containerStyle={[style, { borderRadius: theme.borderRadius.m }]}
      contentStyle={{
        backgroundColor,
        borderRadius: theme.borderRadius.m,
        overflow: 'hidden',
      }}
      highlightOpacity={highlightOpacity}
    >
        <TouchableOpacity
        style={[styles.button, buttonSizeStyle]}
        {...props}
        >
            {icon && Icon && <Icon name={icon} size={finalIconSize} color={styles[`${variant}Text`].color} style={styles.icon} />}
            <Text style={[styles.text, styles[`${variant}Text`], textSizeStyle]}>{title}</Text>
        </TouchableOpacity>
    </NeumorphicOutset>
  );
};