import React from 'react';
import { TextInput, TextInputProps, Text, View, StyleSheet } from 'react-native';
import { NeumorphicInset, StyledTextInput, useTheme } from '@repo/ui';

interface NumberInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  adjustment?: string;
}

const NumberInput = React.forwardRef<TextInput, NumberInputProps>(({ style, inputStyle, adjustment, ...props }, ref) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.s,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.m,
      overflow: 'hidden',
    },
    input: {
        borderWidth: 0,
        padding: 0,
        margin: 0,
        textAlign: 'center',
        ...theme.typography.label,
        color: theme.colors.text,
        flex: 1,
        backgroundColor: 'transparent',
    }
  });

  return (
    <NeumorphicInset style={[styles.container, style]}>
      <StyledTextInput
        ref={ref}
        {...props}
        keyboardType="numeric"
        style={[styles.input, inputStyle]}
      />
      {adjustment && <Text style={{ color: theme.colors.success, ...theme.typography.label, paddingRight: theme.spacing.s }}>{adjustment}</Text>}
    </NeumorphicInset>
  );
});

export default NumberInput;