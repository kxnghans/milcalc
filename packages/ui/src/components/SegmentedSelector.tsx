import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from "../contexts/ThemeContext";

interface SegmentedSelectorProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: any) => void;
}

export const SegmentedSelector = ({ options, selectedValue, onValueChange, style, onLayout }: SegmentedSelectorProps) => {
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
      paddingHorizontal: theme.spacing.s,
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
    <View style={[styles.container, style]} onLayout={onLayout}>
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