import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useTheme, NeumorphicInset, NeumorphicOutset } from '@repo/ui';

export default function PayCalculator() {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    text: {
      ...theme.typography.header,
      color: theme.colors.text,
      marginBottom: theme.spacing.l,
    },
    inputContainer: {
      width: '80%',
      marginBottom: theme.spacing.l,
    },
    outputContainer: {
      width: '80%',
    },
    textInput: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    outputText: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pay Calculator</Text>

      <View style={styles.inputContainer}>
        <NeumorphicInset>
          <TextInput
            style={styles.textInput}
            placeholder="Enter a value"
            placeholderTextColor={theme.colors.placeholder}
            value={inputValue}
            onChangeText={setInputValue}
          />
        </NeumorphicInset>
      </View>

      <View style={styles.outputContainer}>
        <NeumorphicOutset>
          <Text style={styles.outputText}>
            {inputValue || 'Output will be shown here'}
          </Text>
        </NeumorphicOutset>
      </View>
    </View>
  );
}