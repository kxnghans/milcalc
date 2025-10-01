/**
 * @file NumberInput.tsx
 * @description This file defines a custom component for numeric input, styled with a
 * "pressed-in" neumorphic effect. It's a specialized wrapper around the StyledTextInput.
 */

import React from 'react';
import { TextInput, TextInputProps, Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { NeumorphicInset, StyledTextInput, useTheme } from '@repo/ui';

/**
 * Props for the NumberInput component.
 */
interface NumberInputProps extends TextInputProps {
  /** Optional custom styles for the outer container. */
  style?: StyleProp<ViewStyle>;
  /** Optional custom styles for the input field itself. */
  inputStyle?: StyleProp<ViewStyle>;
  /** An optional string to display an adjustment (e.g., for altitude), shown next to the input. */
  adjustment?: string;
}

/**
 * A custom input component specifically for numbers, featuring a neumorphic inset style.
 * It forwards a ref to the underlying TextInput component.
 * @param {NumberInputProps} props - The component props.
 * @param {React.Ref<TextInput>} ref - The ref to be forwarded to the TextInput component.
 * @returns {JSX.Element} The rendered number input component.
 */
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
    // The component is wrapped in a NeumorphicInset to give it the "pressed-in" look.
    <NeumorphicInset style={[styles.container, style]}>
      <StyledTextInput
        ref={ref}
        {...props}
        keyboardType="numeric" // Set the keyboard type to numeric for a better user experience.
        style={[styles.input, inputStyle]}
      />
      {/* Optionally display an adjustment value, like for altitude correction. */}
      {adjustment && <Text style={{ color: theme.colors.success, ...theme.typography.label, paddingRight: theme.spacing.s }}>{adjustment}</Text>}
    </NeumorphicInset>
  );
});

export default NumberInput;