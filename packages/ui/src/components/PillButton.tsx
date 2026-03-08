import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, View } from 'react-native';
import NeumorphicOutset from './NeumorphicOutset';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';

interface PillButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  icon?: string;
}

export const PillButton = ({ title, onPress, backgroundColor, textColor, style, textStyle, disabled, icon }: PillButtonProps) => {
  const { theme } = useTheme();

  const buttonColor = disabled ? theme.colors.disabled : backgroundColor || theme.colors.primary;
  const buttonTextColor = textColor || theme.colors.primaryText;

  const styles = StyleSheet.create({
    button: {
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
        alignSelf: 'center',
    },
    text: {
      color: buttonTextColor,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    outsetContent: {
      borderRadius: 20,
    },
    icon: {
      marginRight: 8,
    },
  });

  return (
    <NeumorphicOutset 
      containerStyle={[styles.buttonContainer, style]}
      contentStyle={styles.outsetContent} // Explicitly pass the pill radius
    >
      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonColor }]}
        onPress={onPress}
        disabled={disabled}
      >
        {icon && (
          <View style={styles.icon}>
            <Icon name={icon} size={18} color={buttonTextColor} />
          </View>
        )}
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </NeumorphicOutset>
  );
};
