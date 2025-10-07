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
  containerStyle?: StyleProp<ViewStyle>;
}

export const PayDisplay: React.FC<PayDisplayProps> = ({ totalPay, payDetails, containerStyle }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.m,
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
    <NeumorphicOutset containerStyle={[styles.container, containerStyle]}>
      <View style={styles.totalPayContainer}>
        <Text style={styles.totalPayLabel}>Total Pay</Text>
        <Text style={styles.totalPayValue}>{totalPay}</Text>
      </View>
      <View style={styles.detailsContainer}>
        {payDetails.map((detail, index) => (
          <View key={index} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{detail.label}</Text>
            <Text style={styles.detailValue}>{detail.value}</Text>
          </View>
        ))}
      </View>
    </NeumorphicOutset>
  );
};
