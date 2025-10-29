import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import NeumorphicOutset from './NeumorphicOutset';
import { useTheme } from '../contexts/ThemeContext';

interface PillButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<any>;
  disabled?: boolean;
}

export const PillButton = ({ title, onPress, backgroundColor, textColor, style, textStyle, disabled }: PillButtonProps) => {
  const { theme } = useTheme();

  const buttonColor = disabled ? theme.colors.disabled : backgroundColor || theme.colors.primary;
  const buttonTextColor = textColor || theme.colors.primaryText;

  const styles = StyleSheet.create({
    button: {
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      elevation: 2,
    },
    buttonContainer: {
        alignSelf: 'center',
    },
    text: {
      color: buttonTextColor,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <NeumorphicOutset containerStyle={[styles.buttonContainer, style]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonColor }]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </NeumorphicOutset>
  );
};
