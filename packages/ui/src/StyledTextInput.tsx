import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { theme } from './theme';

export const StyledTextInput = (props: TextInputProps) => {
  return <TextInput style={styles.input} placeholderTextColor={theme.colors.border} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    fontSize: theme.typography.body.fontSize,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
  },
});
