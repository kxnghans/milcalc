import React, { useState } from 'react';
import { TextInput, TextInputProps, View, StyleSheet, StyleProp, ViewStyle, Text } from 'react-native';
import { NeumorphicInset, StyledTextInput, useTheme } from '@repo/ui';

interface CurrencyInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
}

const CurrencyInput = React.forwardRef<TextInput, CurrencyInputProps>(({ style, inputStyle, value, onChangeText, ...props }, ref) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const formatValue = (val: string) => {
    if (!val) return '';
    const numberValue = parseFloat(val.replace(/,/g, ''));
    if (isNaN(numberValue)) return '';
    return numberValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onChangeText && value) {
      const numberValue = parseFloat(value.replace(/,/g, ''));
      if (!isNaN(numberValue)) {
        onChangeText(numberValue.toFixed(2));
      }
    }
  };

  const displayValue = isFocused ? value : formatValue(value);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.m,
      overflow: 'hidden',
    },
    currencySymbol: {
      ...theme.typography.label,
      color: theme.colors.text,
      marginRight: theme.spacing.xs,
    },
    input: {
      borderWidth: 0,
      padding: 0,
      margin: 0,
      textAlign: 'left',
      ...theme.typography.label,
      color: theme.colors.text,
      backgroundColor: 'transparent',
      flex: 1,
    },
  });

  return (
    <NeumorphicInset style={[styles.container, style]}>
      <Text style={styles.currencySymbol}>$</Text>
      <StyledTextInput
        ref={ref}
        {...props}
        value={displayValue}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        keyboardType="numeric"
        style={[styles.input, inputStyle]}
      />
    </NeumorphicInset>
  );
});

export default CurrencyInput;