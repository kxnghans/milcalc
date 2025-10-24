import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface PayDetail {
  label: string;
  value: any;
}

interface PayDisplayProps {
  annualPay: number;
  monthlyPay: number;
  payDetails: PayDetail[];
  deductions: PayDetail[];
  containerStyle?: StyleProp<ViewStyle>;
  federalStandardDeduction: number;
  stateStandardDeduction: number;
  isStandardDeductionsExpanded: boolean;
  onToggleStandardDeductions: () => void;
}

export const PayDisplay: React.FC<PayDisplayProps> = ({ annualPay, monthlyPay, payDetails, deductions, containerStyle, federalStandardDeduction, stateStandardDeduction, isStandardDeductionsExpanded, onToggleStandardDeductions }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    totalPayContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.m,
    },
    annualLabel: {
      ...theme.typography.title,
      color: theme.colors.primary,
    },
    totalPayLabel: {
      color: theme.colors.text,
      textTransform: 'uppercase',
      ...theme.typography.label
    },
    totalPayValue: {
      ...theme.typography.title,
      color: theme.colors.primary,
    },
    payRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    detailsContainer: {
      width: '100%',
    },
    columnHeader: {
        ...theme.typography.subtitle,
        color: theme.colors.text,
        textTransform: 'uppercase',
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
      ...theme.typography.label,
      fontWeight: '500',
      color: theme.colors.text,
    },
  });

  const renderCurrency = (value: any) => {
    if (typeof value === 'number') {
      return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return value;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.totalPayContainer}>
        <View style={styles.payRow}>
          <Text style={styles.annualLabel}>ANNUAL: </Text>
          <Text style={styles.totalPayValue}>${renderCurrency(annualPay)}</Text>
        </View>
        <View style={[styles.payRow, { marginTop: theme.spacing.s }]}>
          <Text style={styles.totalPayLabel}>MONTHLY: </Text>
          <Text style={styles.detailValue}>${renderCurrency(monthlyPay)}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        {/* Left Column: Income */}
        <View style={{ flex: 1, marginRight: theme.spacing.m }}>
            <Text style={styles.columnHeader}>Income</Text>
            <View style={{marginTop: theme.spacing.s}}>
                {payDetails.map((detail, index) => (
                <View key={index} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{detail.label === 'Other' ? detail.label : detail.label.toUpperCase()}</Text>
                    <Text style={styles.detailValue}>{renderCurrency(detail.value)}</Text>
                </View>
                ))}
            </View>
        </View>
        {/* Right Column: Deductions */}
        <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
            <Text style={styles.columnHeader}>Deductions</Text>
            <View style={{marginTop: theme.spacing.s}}>
                {deductions.map((deduction, index) => (
                <View key={index} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{deduction.label === 'Other' ? deduction.label : deduction.label.toUpperCase()}</Text>
                    <Text style={styles.detailValue}>{renderCurrency(deduction.value)}</Text>
                </View>
                ))}
            </View>
        </View>
      </View>
      {!isStandardDeductionsExpanded && (
        <View style={{ marginTop: 0, width: '100%', alignItems: 'center' }}>
          <Pressable onPress={onToggleStandardDeductions}>
            <MaterialCommunityIcons name='chevron-down' size={24} color={theme.colors.primary} />
          </Pressable>
        </View>
      )}
      {isStandardDeductionsExpanded && (
        <View style={{ marginTop: theme.spacing.m, width: '100%' }}>
          <Text style={styles.columnHeader}>Standard Deductions</Text>
          <View style={{marginTop: theme.spacing.s}}>
              <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Federal</Text>
                  <Text style={styles.detailValue}>${federalStandardDeduction.toLocaleString()}</Text>
              </View>
              <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>State</Text>
                  <Text style={styles.detailValue}>${stateStandardDeduction.toLocaleString()}</Text>
              </View>
          </View>
          <View style={{ marginTop: 0, width: '100%', alignItems: 'center' }}>
            <Pressable onPress={onToggleStandardDeductions}>
              <MaterialCommunityIcons name='chevron-up' size={24} color={theme.colors.primary} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};