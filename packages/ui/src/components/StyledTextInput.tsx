/**
 * @file StyledTextInput.tsx
 * @description This file defines a custom TextInput component that is styled according to the application's theme.
 * It serves as a reusable and consistently styled input field across the app.
 */

import React, { useMemo } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from "../contexts/ThemeContext";

/**
 * A custom TextInput component that applies the application's theme styles.
 * It forwards a ref to the underlying TextInput component, allowing parent components to interact with it directly (e.g., to focus it).
 * @param {TextInputProps} props - The standard TextInput props, plus an optional style override.
 * @param {React.Ref<TextInput>} ref - The ref to be forwarded to the TextInput component.
 * @returns {JSX.Element} The styled TextInput component.
 */
export const StyledTextInput = React.forwardRef<TextInput, TextInputProps>(({ style, onFocus, selectTextOnFocus, value, ...props }, ref) => {
  const { theme } = useTheme();
  const internalRef = React.useRef<TextInput>(null);
  const resolvedRef = (ref as React.RefObject<TextInput>) ?? internalRef;

  const styles = useMemo(() => StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.m,
      padding: theme.spacing.m,
      ...theme.typography.label,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
  }), [theme]);

  const handleFocus = React.useCallback((e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
    // Cross-platform select-all on focus. selectTextOnFocus is Android-only in RN,
    // so we replicate the behaviour for iOS via setNativeProps after a brief delay.
    if (selectTextOnFocus) {
      setTimeout(() => {
        resolvedRef.current?.setNativeProps({
          selection: { start: 0, end: value?.length ?? 999 },
        });
      }, 50);
    }
    onFocus?.(e);
  }, [selectTextOnFocus, onFocus, value, resolvedRef]);

  return (
    <TextInput
      ref={resolvedRef}
      style={[styles.input, style]}
      placeholderTextColor={theme.colors.placeholder}
      selectionColor={theme.colors.primary}
      value={value}
      onFocus={handleFocus}
      {...props}
    />
  );
});

StyledTextInput.displayName = 'StyledTextInput';