/**
 * @file StyledPicker.tsx
 * @description This file defines a custom Picker component that is styled according to the application's theme.
 * It wraps the `@react-native-picker/picker` component to provide a consistent look and feel.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from "../contexts/ThemeContext";
import { Picker, PickerProps } from '@react-native-picker/picker';

/**
 * Props for the StyledPicker component.
 */
interface StyledPickerProps extends PickerProps {
  /** An array of items to be displayed in the picker. Each item must have a label and a value. */
  items: { label: string; value: string }[];
  /** An optional placeholder label to show when no value is selected. */
  placeholder?: string;
}

/**
 * A custom Picker component that applies the application's theme styles.
 * It also supports an optional placeholder item.
 * @param {StyledPickerProps} props - The props for the component.
 * @returns {JSX.Element} The rendered Picker component.
 */
export const StyledPicker = ({ selectedValue, onValueChange, items, placeholder, style, ...props }: StyledPickerProps) => {
  // Use the useTheme hook to get the current theme, ensuring the component is dynamic.
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    picker: {
        // These styles are now dynamically applied based on the current theme.
        borderRadius: theme.borderRadius.m,
        color: theme.colors.text, // Ensure text color matches the theme.
    },
  });

  return (
    <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={[styles.picker, style]}
        {...props}
    >
        {/* Render a disabled placeholder item if one is provided. */}
        {placeholder && <Picker.Item label={placeholder} value={null} enabled={false} />}
        {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
    </Picker>
  );
};