import React from 'react';
import { TextInput, TextInputProps, View, StyleSheet, StyleProp, ViewStyle, Text } from 'react-native';
import { NeumorphicInset, StyledTextInput, useTheme } from '@repo/ui';

interface CurrencyInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
}

const CurrencyInput = React.forwardRef<TextInput, CurrencyInputProps>(({ style, inputStyle, ...props }, ref) => {
  const { theme } = useTheme();

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
      flex: 1,
      backgroundColor: 'transparent',
    },
  });

  return (
    <NeumorphicInset style={[styles.container, style]}>
      <Text style={styles.currencySymbol}>$</Text>
      <StyledTextInput
        ref={ref}
        {...props}
        keyboardType="numeric"
        style={[styles.input, inputStyle]}
      />
    </NeumorphicInset>
  );
});

export default CurrencyInput;
