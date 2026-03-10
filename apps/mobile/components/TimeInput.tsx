/**
 * @file TimeInput.tsx
 * @description This file defines a custom component for inputting time in a "minutes:seconds" format.
 * It uses neumorphic styling and provides a seamless user experience by auto-focusing the next field.
 */

import React, { useRef, useMemo } from 'react';
import { TextInput, Text, StyleProp, ViewStyle, View } from 'react-native';
import { NeumorphicInset, StyledTextInput, useTheme, ExemptButton } from '@repo/ui';

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
  style?: StyleProp<ViewStyle>;
  /** Placeholder text for the minutes input. Defaults to "mm". */
  minutesPlaceholder?: string;
  /** Placeholder text for the seconds input. Defaults to "ss". */
  secondsPlaceholder?: string;
  /** An optional function to call when the exempt button is toggled. If provided, the button will be rendered. */
  onToggleExempt?: () => void;
  /** Whether the component is currently exempt. When true, the input is non-editable and shows 'xx'. */
  isExempt?: boolean;
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
  onToggleExempt,
  isExempt,
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
    if (value.length === 2 || parseInt(value, 10) >= 6) {
      secondsInput.current?.focus();
    }
  };

  const handleSecondsChange = (value: string) => {
    setSeconds(value);
  };

  const handleSecondsBlur = () => {
    if (seconds.length === 1) {
      setSeconds(`0${seconds}`);
    }
  };

  const styles = useMemo(() => ({
    container: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingLeft: theme.spacing.s,
      paddingRight: theme.spacing.s,
      paddingVertical: theme.spacing.s,
      backgroundColor: 'transparent',
    },
    separator: {
      ...theme.typography.label,
      color: theme.colors.text,
      marginHorizontal: 2,
    },
    input: {
      borderWidth: 0,
      padding: 0,
      margin: 0,
      textAlign: 'center' as const,
      flex: 1,
      ...theme.typography.label,
      color: theme.colors.text,
      backgroundColor: 'transparent',
    },
    leftContainer: {
      flex: onToggleExempt ? 1 : 0,
      alignItems: 'flex-start' as const,
      justifyContent: 'center' as const,
    },
    rightGroup: {
      flex: onToggleExempt ? 2 : 1,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    inputGroup: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flex: 1,
      left: onToggleExempt ? ('-15%' as const) : ('0%' as const),
    },
    adjustment: {
      position: 'absolute' as const,
      right: 0,
      color: theme.colors.success,
      ...theme.typography.label,
      backgroundColor: 'transparent',
      textShadowRadius: 0.05,
      textShadowColor: theme.colors.neumorphic.outset.shadow,
    }
  }), [theme, onToggleExempt]);

  // When exempt, show 'xx' as the placeholder. Otherwise, use the placeholder from props.
  const currentMinutesPlaceholder = isExempt ? 'xx' : minutesPlaceholder;
  const currentSecondsPlaceholder = isExempt ? 'xx' : secondsPlaceholder;

  return (
    <NeumorphicInset containerStyle={style} contentStyle={styles.container}>
      {onToggleExempt ? (
        <View style={styles.leftContainer}>
          <ExemptButton
            onPress={onToggleExempt}
            isActive={!!isExempt}
          />
        </View>
      ) : <View style={styles.leftContainer} />}

      <View style={styles.rightGroup}>
        <View style={styles.inputGroup}>
          <StyledTextInput
            value={minutes}
            onChangeText={handleMinutesChange}
            placeholder={currentMinutesPlaceholder}
            maxLength={2}
            keyboardType="numeric"
            style={styles.input}
            editable={!isExempt}
          />
          <Text style={styles.separator}>:</Text>
          <StyledTextInput
            ref={secondsInput}
            value={seconds}
            onChangeText={handleSecondsChange}
            onBlur={handleSecondsBlur}
            placeholder={currentSecondsPlaceholder}
            maxLength={2}
            keyboardType="numeric"
            style={styles.input}
            editable={!isExempt}
          />
        </View>
        {adjustment && (
          <Text style={styles.adjustment}>{adjustment}</Text>
        )}
      </View>
    </NeumorphicInset>
  );
};

export default TimeInput;
