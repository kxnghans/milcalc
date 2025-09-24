import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from './contexts/ThemeContext';

interface SegmentedSelectorProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export const SegmentedSelector = ({ options, selectedValue, onValueChange }: SegmentedSelectorProps) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.borderRadius.m,
      overflow: 'hidden',
    },
    segment: {
      flex: 1,
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedSegment: {
      backgroundColor: theme.colors.primary,
    },
    text: {
      ...theme.typography.body,
      color: theme.colors.text,
      textAlign: 'center',
    },
    selectedText: {
      color: theme.colors.primaryText,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.segment,
            selectedValue === option.value && styles.selectedSegment,
          ]}
          onPress={() => onValueChange(option.value)}
        >
          <Text
            style={[
              styles.text,
              selectedValue === option.value && styles.selectedText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
