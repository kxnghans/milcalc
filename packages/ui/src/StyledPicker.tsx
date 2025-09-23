import React from 'react';
import { StyleSheet } from 'react-native';
import { theme } from './theme';
import { Picker } from '@react-native-picker/picker';
import { PickerProps } from '@react-native-picker/picker';

interface StyledPickerProps extends PickerProps {
  items: { label: string; value: string }[];
  placeholder?: string;
}

export const StyledPicker = ({ selectedValue, onValueChange, items, placeholder, style, ...props }: StyledPickerProps) => {
  return (
    <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={[styles.picker, style]}
        {...props}
    >
        {placeholder && <Picker.Item label={placeholder} value={null} enabled={false} />}
        {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
    </Picker>
  );
};

const styles = StyleSheet.create({
    picker: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.m,
    },
});
