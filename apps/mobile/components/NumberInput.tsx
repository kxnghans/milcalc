/**
 * @file NumberInput.tsx
 * @description This file defines a custom component for numeric input, styled with a
 * "pressed-in" neumorphic effect. It's a specialized wrapper around the StyledTextInput.
 */

import React, { useMemo } from 'react';
import { TextInput, TextInputProps, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTheme, ExemptButton } from '@repo/ui';
import InsetTextInput from './InsetTextInput';

/**
 * Props for the NumberInput component.
 */
interface NumberInputProps extends Omit<TextInputProps, 'style'> {
  /** Optional custom styles for the outer container. */
  style?: StyleProp<ViewStyle>;
  /** Optional custom styles for the input field itself. */
  inputStyle?: StyleProp<TextStyle>;
  /** An optional string to display an adjustment (e.g., for altitude), shown next to the input. */
  adjustment?: string;
  /** An optional function to call when the exempt button is toggled. If provided, the button will be rendered. */
  onToggleExempt?: () => void;
  /** Whether the component is currently exempt. When true, the input is non-editable and shows 'xx'. */
  isExempt?: boolean;
}

/**
 * A custom input component specifically for numbers, featuring a neumorphic inset style.
 * It forwards a ref to the underlying TextInput component.
 * @param {NumberInputProps} props - The component props.
 * @param {React.Ref<TextInput>} ref - The ref to be forwarded to the TextInput component.
 * @returns {JSX.Element} The rendered number input component.
 */
const NumberInput = React.forwardRef<TextInput, NumberInputProps>(({ style, inputStyle, adjustment, onToggleExempt, isExempt, ...props }, ref) => {
  const { theme } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    input: {
      textAlign: 'center',
    },
    adjustment: {
      color: theme.colors.success,
      ...theme.typography.label,
      paddingRight: theme.spacing.s,
    },
  }), [theme]);

  // When exempt, show 'xx' as the placeholder. Otherwise, use the placeholder from props.
  const placeholder = isExempt ? 'xx' : props.placeholder;

  return (
    <InsetTextInput
      ref={ref}
      style={style}
      inputStyle={[styles.input, inputStyle]}
      leftContent={onToggleExempt ? (
        <ExemptButton
          onPress={onToggleExempt}
          isActive={!!isExempt}
        />
      ) : undefined}
      rightContent={adjustment ? (
        <Text style={styles.adjustment}>{adjustment}</Text>
      ) : undefined}
      {...props}
      placeholder={placeholder}
      editable={!isExempt}
      keyboardType="numeric"
    />
  );
});

NumberInput.displayName = 'NumberInput';

export default NumberInput;
