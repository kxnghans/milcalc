import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { NeumorphicInset, StyledTextInput, useTheme } from '@repo/ui';

interface NumberInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
}

const NumberInput = React.forwardRef<TextInput, NumberInputProps>(({ style, inputStyle, ...props }, ref) => {
  const { theme } = useTheme();

  return (
    <NeumorphicInset style={[{ borderRadius: theme.borderRadius.m, overflow: 'hidden' }, style]}>
      <StyledTextInput
        ref={ref}
        {...props}
        keyboardType="numeric"
        style={[{
          ...theme.typography.body,
          color: theme.colors.text,
          textAlign: 'center',
          borderWidth: 0, // remove the border from StyledTextInput
          paddingVertical: theme.spacing.s, // remove the padding from StyledTextInput
        }, inputStyle]}
      />
    </NeumorphicInset>
  );
});

export default NumberInput;