/**
 * @file SegmentedSelector.tsx
 * @description This file defines a custom segmented control component with a neumorphic design.
 * It supports multiple selections and can be rendered as a non-interactive display.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle, LayoutChangeEvent } from 'react-native';
import * as Icons from '@expo/vector-icons';
import NeumorphicOutset from './NeumorphicOutset';
import { useTheme } from "../contexts/ThemeContext";
import { getAlphaColor } from '../theme';
import { Icon } from './Icon';
import { ICON_SETS } from '../icons';

/**
 * Props for the SegmentedSelector component.
 */
interface SegmentedSelectorProps {
  /** An array of options to display, where each option has a label and a value. */
  options: { label: string; value: string; icon?: string; iconSet?: keyof typeof Icons }[];
  /** An array of values corresponding to the currently selected options. */
  selectedValues: string[];
  /** A function to be called when an option is selected. */
  onValueChange: (value: string) => void;
  /** An array of numbers to set the flex ratio for each segment. */
  ratios?: number[];
  /** Optional custom style for the container. */
  style?: StyleProp<ViewStyle>;
  /** Optional layout event handler. */
  onLayout?: (event: LayoutChangeEvent) => void;
  /** If false, the selector will be non-interactive. Defaults to true. */
  isTouchable?: boolean;
  /** Optional background color for the selected segment. */
  selectedBackgroundColor?: string;
  /** Optional text style for the selected segment. */
  selectedTextStyle?: StyleProp<TextStyle>;
}

/**
 * A custom segmented control component that displays a set of options.
 * It can handle multiple selections and has a distinct neumorphic style for selected items.
 * It can also be used as a non-interactive display.
 */
export const SegmentedSelector = ({ options, selectedValues, onValueChange, style, onLayout, isTouchable = true, ratios, selectedBackgroundColor, selectedTextStyle }: SegmentedSelectorProps) => {
  const { theme, isDarkMode } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: theme.borderRadius.m,
    },
    segment: {
      flex: 1,
      paddingVertical: theme.spacing.s + theme.spacing.xs, // Increased to match selected segment's total height (padding + margin)
      paddingHorizontal: theme.spacing.xs,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedSegment: {
      paddingVertical: theme.spacing.s, // Reduced because it has container margins
      paddingHorizontal: theme.spacing.xs,
    },
    contentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      ...theme.typography.body,
      color: theme.colors.text,
      textAlign: 'center',
      includeFontPadding: false,
    },
    selectedText: {
      ...theme.typography.bodybold,
      color: theme.colors.primaryText,
      textAlign: 'center',
      includeFontPadding: false,
    },
    captionText: {
        ...theme.typography.caption,
        color: theme.colors.text,
        textAlign: 'center',
        includeFontPadding: false,
    },
    selectedCaptionText: {
        ...theme.typography.caption,
        color: theme.colors.primaryText,
        textAlign: 'center',
        includeFontPadding: false,
    },
    outsetContainer: {
      borderRadius: theme.borderRadius.m,
      backgroundColor: theme.colors.secondary,
    },
    outsetContent: {
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.borderRadius.m,
      overflow: 'hidden',
    },
    selectedOutsetContainer: {
      borderRadius: theme.borderRadius.m,
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
      marginLeft: theme.spacing.xs,
      marginRight: theme.spacing.xs,
      alignSelf: 'stretch',
    },
    selectedOutsetContent: {
      borderRadius: theme.borderRadius.m,
      overflow: 'hidden',
      flex: 1,
    },
    flex1: {
      flex: 1,
    },
    icon: {
      marginRight: theme.spacing.xs,
    },
  });

  const highlightColor = isDarkMode ? getAlphaColor('#000000', 1) : undefined;

  return (
    <NeumorphicOutset
      containerStyle={[style, styles.outsetContainer]}
      contentStyle={styles.outsetContent}
      highlightColor={highlightColor}
      highlightOpacity={isDarkMode ? 0.05 : theme.colors.neumorphic.outset.highlightOpacity}
    >
      <View style={styles.container} onLayout={onLayout}>
        {options.map((option, index) => {
          const flexRatio = ratios && ratios.length === options.length ? ratios[index] : 1;
          const lines = option.label.split('\n');
          const isSelected = (selectedValues || []).includes(option.value);

          // Use TouchableOpacity for interactive segments, and View for non-interactive ones.
          const Wrapper = isTouchable ? TouchableOpacity : View;

          // Render the selected segment with a distinct neumorphic style.
          if (isSelected) {
            return (
              <NeumorphicOutset
                key={option.value}
                containerStyle={[styles.selectedOutsetContainer, { flex: flexRatio }]}
                contentStyle={[styles.selectedOutsetContent, { backgroundColor: selectedBackgroundColor || theme.colors.primary }]}
                highlightStyle={styles.flex1}
                shadowOpacity={isDarkMode ? undefined : 0.3}
                highlightOpacity={isDarkMode ? 0.55 : theme.colors.neumorphic.outset.highlightOpacity}
              >
                <Wrapper
                  style={[styles.segment, styles.selectedSegment]}
                  onPress={() => onValueChange(option.value)}
                >
                  <View style={styles.contentRow}>
                    {option.icon && (
                      <Icon
                        name={option.icon}
                        size={18}
                        color={theme.colors.primaryText}
                        style={styles.icon}
                        iconSet={option.iconSet || ICON_SETS.MATERIAL_COMMUNITY}
                      />
                    )}
                    {/* Support for multi-line labels */}
                    <View>
                      {lines.map((line, index) => (
                        <Text key={index} style={[index === 0 ? styles.selectedText : styles.selectedCaptionText, selectedTextStyle]}>
                          {line}
                        </Text>
                      ))}
                    </View>
                  </View>
                </Wrapper>
              </NeumorphicOutset>
            )
          }
          // Render a standard, unselected segment.
          return (
            <Wrapper
              key={option.value}
              style={[styles.segment, { flex: flexRatio }]}
              onPress={() => onValueChange(option.value)}
            >
              <View style={styles.contentRow}>
                {option.icon && (
                  <Icon
                    name={option.icon}
                    size={18}
                    color={theme.colors.text}
                    style={styles.icon}
                    iconSet={option.iconSet || ICON_SETS.MATERIAL_COMMUNITY}
                  />
                )}
                <View>
                  {lines.map((line, index) => (
                    <Text key={index} style={index === 0 ? styles.text : styles.captionText}>
                      {line}
                    </Text>
                  ))}
                </View>
              </View>
            </Wrapper>
          )
        })}
      </View>
    </NeumorphicOutset>
  );
};
