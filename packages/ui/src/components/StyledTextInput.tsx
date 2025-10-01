/**
 * @file StyledTextInput.tsx
 * @description This file defines a custom TextInput component that is styled according to the application's theme.
 * It serves as a reusable and consistently styled input field across the app.
 */

import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from "../contexts/ThemeContext";

/**
 * A custom TextInput component that applies the application's theme styles.
 * It forwards a ref to the underlying TextInput component, allowing parent components to interact with it directly (e.g., to focus it).
 * @param {TextInputProps} props - The standard TextInput props, plus an optional style override.
 * @param {React.Ref<TextInput>} ref - The ref to be forwarded to the TextInput component.
 * @returns {JSX.Element} The styled TextInput component.
 */
export const StyledTextInput = React.forwardRef<TextInput, TextInputProps>(({ style, ...props }, ref) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.m,
      padding: theme.spacing.m,
      ...theme.typography.label,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      textAlign: 'center',
    },
  });

  // The component applies the default styles and merges any custom styles passed in the `style` prop.
  // It also sets the placeholder text color from the theme.
  return <TextInput ref={ref} style={[styles.input, style]} placeholderTextColor={theme.colors.placeholder} {...props} />;
});