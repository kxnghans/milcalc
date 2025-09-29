import React, { useRef } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import { NeumorphicInset, StyledTextInput, useTheme } from '@repo/ui';

interface TimeInputProps {
  minutes: string;
  setMinutes: (minutes: string) => void;
  seconds: string;
  setSeconds: (seconds: string) => void;
  adjustment?: string;
  style?: any;
}

const TimeInput: React.FC<TimeInputProps> = ({ minutes, setMinutes, seconds, setSeconds, adjustment, style }) => {
  const { theme } = useTheme();
  const secondsInput = useRef<TextInput>(null);

  const handleMinutesChange = (value: string) => {
    setMinutes(value);
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
    <NeumorphicInset style={[styles.container, style]}>
        <StyledTextInput
            value={minutes}
            onChangeText={handleMinutesChange}
            placeholder="Minutes"
            maxLength={2}
            keyboardType="numeric"
            style={styles.input}
        />
        <Text style={styles.separator}>:</Text>
        <StyledTextInput
            ref={secondsInput}
            value={seconds}
            onChangeText={setSeconds}
            placeholder="Seconds"
            maxLength={2}
            keyboardType="numeric"
            style={styles.input}
        />
        {adjustment && <Text style={{ color: theme.colors.success, ...theme.typography.label, marginHorizontal: theme.spacing.s, backgroundColor: 'transparent', textShadowRadius: 0.05, textShadowColor: theme.colors.neumorphic.outset.shadow }}>{adjustment}</Text>}
    </NeumorphicInset>
  );
};

export default TimeInput;