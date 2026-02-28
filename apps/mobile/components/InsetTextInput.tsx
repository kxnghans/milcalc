import React from 'react';
import { TextInput, TextInputProps, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { NeumorphicInset, StyledTextInput, useTheme } from '@repo/ui';

interface InsetTextInputProps extends Omit<TextInputProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const InsetTextInput = React.forwardRef<TextInput, InsetTextInputProps>(({ style, inputStyle, ...props }, ref) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.m,
      overflow: 'hidden',
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
      <StyledTextInput
        ref={ref}
        {...props}
        style={[styles.input, inputStyle]}
      />
    </NeumorphicInset>
  );
});

InsetTextInput.displayName = 'InsetTextInput';

export default InsetTextInput;
