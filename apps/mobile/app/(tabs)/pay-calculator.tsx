/**
 * @file pay-calculator.tsx
 * @description This file defines the placeholder screen for the Pay Calculator feature.
 * It currently includes a basic UI for input and output but lacks any calculation logic.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useTheme, NeumorphicInset, NeumorphicOutset } from '@repo/ui';

/**
 * A placeholder component for the Pay Calculator screen.
 * It currently renders an input field and displays the entered text in an output area.
 * @returns {JSX.Element} The rendered placeholder screen.
 */
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
    neumorphicOutsetContainer: {
    },
    neumorphicOutsetContent: {
      borderRadius: theme.borderRadius.m,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.m,
      overflow: 'hidden',
    },
    neumorphicInsetStyle: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.m,
      padding: theme.spacing.m,
      overflow: 'hidden',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pay Calculator</Text>

      {/* Input section with a neumorphic inset effect. */}
      <View style={styles.inputContainer}>
        <NeumorphicInset style={styles.neumorphicInsetStyle}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter a value"
            placeholderTextColor={theme.colors.placeholder}
            value={inputValue}
            onChangeText={setInputValue}
          />
        </NeumorphicInset>
      </View>

      {/* Output section with a neumorphic outset effect. */}
      <View style={styles.outputContainer}>
        <NeumorphicOutset containerStyle={styles.neumorphicOutsetContainer} contentStyle={styles.neumorphicOutsetContent}>
          <Text style={styles.outputText}>
            {/* Currently just echoes the input value. */}
            {inputValue || 'Output will be shown here'}
          </Text>
        </NeumorphicOutset>
      </View>
    </View>
  );
}