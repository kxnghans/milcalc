import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { NeumorphicInset, StyledTextInput, useTheme } from '@repo/ui';

const NumberInput = React.forwardRef<TextInput, TextInputProps>((props, ref) => {
  const { theme } = useTheme();

  return (
    <NeumorphicInset style={{ borderRadius: theme.borderRadius.m, overflow: 'hidden' }}>
      <StyledTextInput
        ref={ref}
        {...props}
        keyboardType="numeric"
        style={{
          ...theme.typography.body,
          color: theme.colors.text,
          textAlign: 'center',
          borderWidth: 0, // remove the border from StyledTextInput
          paddingVertical: theme.spacing.s, // remove the padding from StyledTextInput
        }}
      />
    </NeumorphicInset>
  );
});

export default NumberInput;