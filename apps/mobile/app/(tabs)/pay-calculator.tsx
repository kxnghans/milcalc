import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useTheme, NeumorphicInset, StyledPicker, PayDisplay } from '@repo/ui';
import CurrencyInput from '../components/CurrencyInput';

// Placeholder data for ranks - this would eventually come from a data source
const officerRanks = [
  { label: 'O-1', value: 'O-1' },
  { label: 'O-2', value: 'O-2' },
  { label: 'O-3', value: 'O-3' },
  { label: 'O-4', value: 'O-4' },
  { label: 'O-5', value: 'O-5' },
  { label: 'O-6', value: 'O-6' },
  { label: 'O-7', value: 'O-7' },
  { label: 'O-8', value: 'O-8' },
  { label: 'O-9', value: 'O-9' },
  { label: 'O-10', value: 'O-10' },
];

export default function PayCalculatorScreen() {
  const { theme } = useTheme();

  // Placeholder state and handlers
  const [rank, setRank] = React.useState('O-1');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.m,
    },
    formContainer: {
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.m,
    },
    fieldRow: {
      marginBottom: theme.spacing.l,
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
  });

  // Placeholder pay data
  const payDetails = [
    { label: 'Base Pay', value: '$5,000.00' },
    { label: 'BAH', value: '$1,500.00' },
    { label: 'BAS', value: '$450.25' },
  ];

  return (
    <ScrollView style={styles.container}>
      <PayDisplay
        totalPay="$6,950.25"
        payDetails={payDetails}
        containerStyle={{ marginBottom: theme.spacing.l }}
      />

      <NeumorphicInset containerStyle={styles.formContainer}>
        <View style={styles.fieldRow}>
          <Text style={styles.label}>Pay Grade</Text>
          <StyledPicker items={officerRanks} selectedValue={rank} onValueChange={(itemValue) => setRank(itemValue)} />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Years of Service</Text>
          <CurrencyInput placeholder="0" />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>BAH</Text>
          <CurrencyInput placeholder="0.00" />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Other</Text>
          <CurrencyInput placeholder="0.00" />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Clothing Allowance</Text>
          <CurrencyInput placeholder="0.00" />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Hazardous Duty Incentive Pay</Text>
          <CurrencyInput placeholder="0.00" />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Aviation Incentive Pay</Text>
          <CurrencyInput placeholder="0.00" />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Career Sea Pay</Text>
          <CurrencyInput placeholder="0.00" />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Health Professions Officers</Text>
          <CurrencyInput placeholder="0.00" />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Special Pay</Text>
          <CurrencyInput placeholder="0.00" />
        </View>
      </NeumorphicInset>
    </ScrollView>
  );
}
