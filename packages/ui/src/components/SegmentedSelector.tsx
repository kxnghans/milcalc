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
      // backgroundColor: theme.colors.primary,
      // borderRadius: theme.borderRadius.m,
      // margin: theme.spacing.xs,
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
      {options.map((option) => {
        if (option.value === selectedValue) {
          return (
            <NeumorphicOutset
              key={option.value}
              color={theme.colors.primary}
              containerStyle={{ flex: 1, margin: theme.spacing.xs, borderRadius: theme.borderRadius.m }}
              contentStyle={{}}
            >
              <TouchableOpacity
                style={[
                  styles.segment,
                  styles.selectedSegment,
                ]}
                onPress={() => onValueChange(option.value)}
              >
                <Text
                  style={[
                    styles.text,
                    styles.selectedText,
                  ]}
                >
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
  );
};