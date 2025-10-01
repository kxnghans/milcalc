/**
 * @file TimeInput.tsx
 * @description This file defines a custom component for inputting time in a "minutes:seconds" format.
 * It uses neumorphic styling and provides a seamless user experience by auto-focusing the next field.
 */

import React, { useRef } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import { NeumorphicInset, StyledTextInput, useTheme } from '@repo/ui';

/**
 * Props for the TimeInput component.
 */
interface TimeInputProps {
  /** The current value of the minutes input. */
  minutes: string;
  /** A function to set the minutes value. */
  setMinutes: (minutes: string) => void;
  /** The current value of the seconds input. */
  seconds: string;
  /** A function to set the seconds value. */
  setSeconds: (seconds: string) => void;
  /** An optional string to display an adjustment (e.g., for altitude), shown next to the input. */
  adjustment?: string;
  /** Optional custom styles for the container. */
  style?: any;
  /** Placeholder text for the minutes input. Defaults to "mm". */
  minutesPlaceholder?: string;
  /** Placeholder text for the seconds input. Defaults to "ss". */
  secondsPlaceholder?: string;
}

/**
 * A custom input component for time values (minutes and seconds).
 * It features two separate text inputs styled to look like a single field,
 * and automatically moves focus from minutes to seconds for a better user experience.
 */
const TimeInput: React.FC<TimeInputProps> = ({
  minutes,
  setMinutes,
  seconds,
  setSeconds,
  adjustment,
  style,
  minutesPlaceholder = "mm",
  secondsPlaceholder = "ss",
}) => {
  const { theme } = useTheme();
  // A ref to the seconds input field to allow for programmatic focusing.
  const secondsInput = useRef<TextInput>(null);

  /**
   * Handles changes to the minutes input. When the user has entered two digits,
   * it automatically focuses the seconds input.
   * @param {string} value - The new value of the minutes input.
   */
  const handleMinutesChange = (value: string) => {
    setMinutes(value);
    // Auto-focus the seconds input when the minutes field is filled.
    if (value.length === 2 || parseInt(value) >= 6) {
      secondsInput.current?.focus();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center', // this will center the items in the row
      paddingVertical: theme.spacing.s, // Keep padding for the inset effect
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.m,
      overflow: 'hidden',
    },
    separator: {
      ...theme.typography.label,
      color: theme.colors.text,
      marginHorizontal: theme.spacing.s,
    },
    input: {
        // remove flex: 1
        borderWidth: 0,
        padding: 0,
        margin: 0,
        textAlign: 'center',
        ...theme.typography.label,
        color: theme.colors.text,
        flex: 1,
        backgroundColor: 'transparent',
    }
  });

  return (
    // The component is wrapped in a NeumorphicInset to give it the "pressed-in" look.
    <NeumorphicInset style={[styles.container, style]}>
        <StyledTextInput
            value={minutes}
            onChangeText={handleMinutesChange}
            placeholder={minutesPlaceholder}
            maxLength={2}
            keyboardType="numeric"
            style={styles.input}
        />
        <Text style={styles.separator}>:</Text>
        <StyledTextInput
            ref={secondsInput}
            value={seconds}
            onChangeText={setSeconds}
            placeholder={secondsPlaceholder}
            maxLength={2}
            keyboardType="numeric"
            style={styles.input}
        />
        {/* Optionally display an adjustment value, like for altitude correction. */}
        {adjustment && <Text style={{ color: theme.colors.success, ...theme.typography.label, marginHorizontal: theme.spacing.s, backgroundColor: 'transparent', textShadowRadius: 0.05, textShadowColor: theme.colors.neumorphic.outset.shadow }}>{adjustment}</Text>}
    </NeumorphicInset>
  );
};

export default TimeInput;