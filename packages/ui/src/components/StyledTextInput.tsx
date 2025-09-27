import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from "../contexts/ThemeContext";

export const StyledTextInput = React.forwardRef<TextInput, TextInputProps>((props, ref) => {
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

  return <TextInput ref={ref} style={styles.input} placeholderTextColor={theme.colors.placeholder} {...props} />;
});