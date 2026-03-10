import React, { useState, useMemo } from 'react';
import { TextInput, TextInputProps, StyleSheet, StyleProp, ViewStyle, Text, TextStyle } from 'react-native';
import { useTheme } from '@repo/ui';
import InsetTextInput from './InsetTextInput';

interface CurrencyInputProps extends Omit<TextInputProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const CurrencyInput = React.forwardRef<TextInput, CurrencyInputProps>(({ style, inputStyle, value = '', onChangeText, ...props }, ref) => {
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

  const styles = useMemo(() => StyleSheet.create({
    currencySymbol: {
      ...theme.typography.label,
      color: theme.colors.text,
      opacity: 0.6,
    },
    input: {
      textAlign: 'center',
    },
  }), [theme]);

  return (
    <InsetTextInput
      ref={ref}
      style={style}
      inputStyle={[styles.input, inputStyle]}
      leftContent={<Text style={styles.currencySymbol}>$</Text>}
      value={displayValue}
      onChangeText={onChangeText}
      onFocus={handleFocus}
      onBlur={handleBlur}
      keyboardType="numeric"
      {...props}
    />
  );
});

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;
