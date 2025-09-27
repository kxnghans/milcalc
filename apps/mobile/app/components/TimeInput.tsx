import React, { useRef } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import { NeumorphicInset, StyledTextInput, useTheme } from '@repo/ui';

interface TimeInputProps {
  minutes: string;
  setMinutes: (minutes: string) => void;
  seconds: string;
  setSeconds: (seconds: string) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ minutes, setMinutes, seconds, setSeconds }) => {
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
      paddingHorizontal: theme.spacing.m, // Keep padding for the inset effect
    },
    separator: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginHorizontal: theme.spacing.s,
    },
    input: {
        // remove flex: 1
        borderWidth: 0,
        padding: 0,
        margin: 0,
        textAlign: 'center',
        ...theme.typography.body,
        color: theme.colors.text,
        width: 30, // set a fixed width
    }
  });

  return (
    <NeumorphicInset>
        <View style={styles.container}>
            <StyledTextInput
                value={minutes}
                onChangeText={handleMinutesChange}
                placeholder="MM"
                maxLength={2}
                keyboardType="numeric"
                style={styles.input}
            />
            <Text style={styles.separator}>:</Text>
            <StyledTextInput
                ref={secondsInput}
                value={seconds}
                onChangeText={setSeconds}
                placeholder="SS"
                maxLength={2}
                keyboardType="numeric"
                style={styles.input}
            />
        </View>
    </NeumorphicInset>
  );
};

export default TimeInput;