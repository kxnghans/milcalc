/**
 * @file SegmentedSelector.tsx
 * @description This file defines a custom segmented control component with a neumorphic design.
 * It supports multiple selections and can be rendered as a non-interactive display.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import NeumorphicOutset from './NeumorphicOutset';
import { useTheme } from "../contexts/ThemeContext";

/**
 * Props for the SegmentedSelector component.
 */
interface SegmentedSelectorProps {
  /** An array of options to display, where each option has a label and a value. */
  options: { label: string; value: string }[];
  /** An array of values corresponding to the currently selected options. */
  selectedValues: string[];
  /** A function to be called when an option is selected. */
  onValueChange: (value: string) => void;
  /** Optional custom style for the container. */
  style?: StyleProp<ViewStyle>;
  /** Optional layout event handler. */
  onLayout?: (event: any) => void;
  /** If false, the selector will be non-interactive. Defaults to true. */
  isTouchable?: boolean;
}

/**
 * A custom segmented control component that displays a set of options.
 * It can handle multiple selections and has a distinct neumorphic style for selected items.
 * It can also be used as a non-interactive display.
 */
export const SegmentedSelector = ({ options, selectedValues, onValueChange, style, onLayout, isTouchable = true }: SegmentedSelectorProps) => {
  const { theme, isDarkMode } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: theme.borderRadius.m,
    },
    segment: {
      flex: 1,
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.xs,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedSegment: {
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.xs,
    },
    text: {
      ...theme.typography.body,
      color: theme.colors.text,
      textAlign: 'center',
    },
    selectedText: {
      ...theme.typography.bodybold,
      color: theme.colors.primaryText,
      textAlign: 'center',
    },
    captionText: {
        ...theme.typography.caption,
        color: theme.colors.text,
        textAlign: 'center',
    },
    selectedCaptionText: {
        ...theme.typography.caption,
        color: theme.colors.primaryText,
        textAlign: 'center',
    }
  });

  return (
    <NeumorphicOutset
      containerStyle={style}
      contentStyle={{ backgroundColor: theme.colors.secondary, borderRadius: theme.borderRadius.m, overflow: 'hidden' }}
      highlightColor={isDarkMode ? 'rgba(0,0,0,1)' : undefined}
      highlightOpacity={isDarkMode ? 0.05 : 1}
    >
      <View style={styles.container} onLayout={onLayout}>
        {options.map((option) => {
          const lines = option.label.split('\n');
          const isSelected = (selectedValues || []).includes(option.value);

          // Use TouchableOpacity for interactive segments, and View for non-interactive ones.
          const Wrapper = isTouchable ? TouchableOpacity : View;

          // Render the selected segment with a distinct neumorphic style.
          if (isSelected) {
            return (
              <NeumorphicOutset
                key={option.value}
                containerStyle={{
                  flex: 1,
                  borderRadius: theme.borderRadius.m,
                  marginTop: theme.spacing.xs,
                  marginBottom: theme.spacing.xs,
                  marginLeft: theme.spacing.xs,
                  marginRight: theme.spacing.xs,
                  alignSelf: 'stretch'
                }}
                contentStyle={{ backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.m, overflow: 'hidden', flex: 1 }}
                highlightStyle={{ flex: 1 }}
                shadowOpacity={isDarkMode ? undefined : 0.3}
                highlightOpacity={isDarkMode ? 0.55 : 1}
              >
                <Wrapper
                  style={[styles.segment, styles.selectedSegment]}
                  onPress={() => onValueChange(option.value)}
                >
                  {/* Support for multi-line labels */}
                  {lines.map((line, index) => (
                    <Text key={index} style={index === 0 ? styles.selectedText : styles.selectedCaptionText}>
                      {line}
                    </Text>
                  ))}
                </Wrapper>
              </NeumorphicOutset>
            )
          }
          // Render a standard, unselected segment.
          return (
            <Wrapper
              key={option.value}
              style={styles.segment}
              onPress={() => onValueChange(option.value)}
            >
              {lines.map((line, index) => (
                <Text key={index} style={index === 0 ? styles.text : styles.captionText}>
                  {line}
                </Text>
              ))}
            </Wrapper>
          )
        })}
      </View>
    </NeumorphicOutset>
  );
};
