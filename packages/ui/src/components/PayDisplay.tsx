import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import NeumorphicOutset from './NeumorphicOutset';

interface PayDetail {
  label: string;
  value: string;
}

interface PayDisplayProps {
  totalPay: string;
  payDetails: PayDetail[];
  deductions: PayDetail[];
  containerStyle?: StyleProp<ViewStyle>;
}

export const PayDisplay: React.FC<PayDisplayProps> = ({ totalPay, payDetails, deductions, containerStyle }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    totalPayContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.l,
    },
    totalPayLabel: {
      ...theme.typography.label,
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
    totalPayValue: {
      ...theme.typography.title,
      color: theme.colors.text,
    },
    detailsContainer: {
      width: '100%',
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.s,
    },
    detailLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    detailValue: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.totalPayContainer}>
        <Text style={styles.totalPayLabel}>Total Pay</Text>
        <Text style={styles.totalPayValue}>{totalPay}</Text>
      </View>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        {/* Left Column: Income */}
        <View style={{ flex: 1, marginRight: theme.spacing.m }}>
            <Text style={styles.detailLabel}>Income</Text>
            <View style={{marginTop: theme.spacing.s}}>
                {payDetails.map((detail, index) => (
                <View key={index} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{detail.label}</Text>
                    <Text style={styles.detailValue}>{detail.value}</Text>
                </View>
                ))}
            </View>
        </View>
        {/* Right Column: Deductions */}
        <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
            <Text style={styles.detailLabel}>Deductions</Text>
            <View style={{marginTop: theme.spacing.s}}>
                {deductions.map((deduction, index) => (
                <View key={index} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{deduction.label}</Text>
                    <Text style={styles.detailValue}>{deduction.value}</Text>
                </View>
                ))}
            </View>
        </View>
      </View>
    </View>
  );
};
