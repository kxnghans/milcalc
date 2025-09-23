import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@repo/ui';

export default function BestScoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Best Score Calculator</Text>
      <Text style={styles.subtitle}>This page is under construction.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.m,
  },
  title: {
    ...theme.typography.header,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
