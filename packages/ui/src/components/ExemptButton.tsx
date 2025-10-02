/**
 * @file ExemptButton.tsx
 * @description This file defines a reusable button for marking a PT component as exempt.
 * It has distinct styles for its active (exempt) and inactive states.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import NeumorphicOutset from './NeumorphicOutset';

interface ExemptButtonProps {
  /** The function to call when the button is pressed. */
  onPress: () => void;
  /** Whether the button is currently in the active/exempt state. */
  isActive: boolean;
  /** Optional custom styles for the container. */
  style?: ViewStyle;
}

/**
 * A button component used to mark a PT component as exempt.
 * It changes its appearance based on whether it is active.
 */
export const ExemptButton: React.FC<ExemptButtonProps> = ({ onPress, isActive, style }) => {
  const { theme, isDarkMode } = useTheme();

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 6,
      paddingHorizontal: theme.spacing.s,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.m,
    },
    text: {
      ...theme.typography.caption,
      color: theme.colors.text,
      fontWeight: '500',
    },
    activeText: {
      color: theme.colors.primaryText,
    },
  });

  const backgroundColor = isActive ? theme.colors.primary : theme.colors.background;

  return (
    <NeumorphicOutset
      containerStyle={[style, { marginTop: 0, marginBottom: 0 }]}
      contentStyle={{
        backgroundColor,
        borderRadius: theme.borderRadius.m,
        overflow: 'hidden',
      }}
      shadowOpacity={isActive ? (isDarkMode ? 0.5 : 0.3) : (isDarkMode ? 0.5 : 0.2)}
      highlightColor={isActive ? (isDarkMode ? theme.colors.neumorphic.outset.highlight : 'white') : (isDarkMode ? theme.colors.neumorphic.outset.highlight : 'white')}
      highlightOpacity={isActive ? (isDarkMode ? 0.3 : 1) : (isDarkMode ? 0.15 : 0.9)}
    >
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <Text style={[styles.text, isActive && styles.activeText]}>EXEMPT</Text>
      </TouchableOpacity>
    </NeumorphicOutset>
  );
};