import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import NeumorphicOutset from './NeumorphicOutset';
import { useTheme } from "../contexts/ThemeContext";

interface SegmentedSelectorProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: any) => void;
}

export const SegmentedSelector = ({ options, selectedValue, onValueChange, style, onLayout }: SegmentedSelectorProps) => {
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
      color: theme.colors.primaryText,
      fontWeight: '600',
    },
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
          if (option.value === selectedValue) {
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
                <TouchableOpacity
                  style={[styles.segment, styles.selectedSegment]}
                  onPress={() => onValueChange(option.value)}
                >
                  <Text style={[styles.text, styles.selectedText]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              </NeumorphicOutset>
            )
          }
          return (
            <TouchableOpacity
              key={option.value}
              style={styles.segment}
              onPress={() => onValueChange(option.value)}
            >
              <Text style={styles.text}>
                {option.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </NeumorphicOutset>
  );
};