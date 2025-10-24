import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, Pressable, Modal, Button, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../contexts/ThemeContext';

interface PayDetail {
  label: string;
  value: number;
}

import { DatePickerModal } from './DatePickerModal';
import { PillButton } from './PillButton';

import NeumorphicInset from './NeumorphicInset';

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
  onGetRetirementAge?: () => void;
  isRetirementAgeCalculatorVisible?: boolean;
  birthDate?: Date;
  setBirthDate?: (date: Date) => void;
  serviceEntryDate?: Date;
  setServiceEntryDate?: (date: Date) => void;
  retirementAge?: number;
  component?: string;
}

export const PayDisplay: React.FC<PayDisplayProps> = ({ annualPay, monthlyPay, payDetails, deductions, containerStyle, federalStandardDeduction, stateStandardDeduction, isStandardDeductionsExpanded, onToggleStandardDeductions, onGetRetirementAge, isRetirementAgeCalculatorVisible, birthDate, setBirthDate, serviceEntryDate, setServiceEntryDate, retirementAge, component }) => {
  const { theme } = useTheme();
  const [showBirthDatePicker, setShowBirthDatePicker] = React.useState(false);
  const [showServiceEntryDatePicker, setShowServiceEntryDatePicker] = React.useState(false);

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
    pressableInput: {
        paddingVertical: theme.spacing.s,
        paddingHorizontal: theme.spacing.s,
        backgroundColor: theme.colors.inputBackground,
    },
    pressableText: {
        ...theme.typography.body,
        color: theme.colors.text,
        textAlign: 'left',
    },
    placeholderText: {
        color: theme.colors.placeholder,
        textAlign: 'left',
    },
  });

  const renderCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.totalPayContainer}>
        <View style={styles.payRow}>
          <Text style={styles.annualLabel}>ANNUAL: </Text>
          <Text style={styles.totalPayValue}>{renderCurrency(annualPay)}</Text>
        </View>
        <View style={[styles.payRow, { marginTop: theme.spacing.s }]}>
          <Text style={styles.totalPayLabel}>MONTHLY: </Text>
          <Text style={styles.detailValue}>{renderCurrency(monthlyPay)}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        {/* Left Column: Income */}
        <View style={{ flex: 1, marginRight: theme.spacing.m }}>
            <Text style={styles.columnHeader}>Income</Text>
            <View style={{marginTop: theme.spacing.s}}>
                {payDetails.map((detail, index) => (
                <View key={index} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{detail.label.toUpperCase()}</Text>
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
                    <Text style={styles.detailLabel}>{deduction.label.toUpperCase()}</Text>
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
          <Text style={styles.columnHeader}>Helpful Info</Text>
          <View style={{marginTop: theme.spacing.s}}>
              <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Federal Std Deduction</Text>
                  <Text style={styles.detailValue}>${federalStandardDeduction.toLocaleString()}</Text>
              </View>
              <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>State Std Deduction</Text>
                  <Text style={styles.detailValue}>${stateStandardDeduction.toLocaleString()}</Text>
              </View>
              {retirementAge && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Retirement Age</Text>
                  <Text style={styles.detailValue}>{retirementAge}</Text>
                </View>
              )}
          </View>
          {onGetRetirementAge && component === 'Active' && (
            <View style={{ marginTop: 0, width: '100%' }}>
              <PillButton title="Get Retirement Age" onPress={onGetRetirementAge} textStyle={theme.typography.bodybold} />
            </View>
          )}
          {isRetirementAgeCalculatorVisible && component === 'Active' && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 0 }}>
              <View style={{ flex: 1, marginRight: theme.spacing.s }}>
                <Text style={[styles.detailLabel, { marginBottom: theme.spacing.s, marginTop: theme.spacing.s }]}>Birth Date</Text>
                <Pressable style={{ marginBottom: theme.spacing.s }} onPress={() => setShowBirthDatePicker(true)}>
                  <NeumorphicInset style={{ borderRadius: theme.borderRadius.m }}>
                    <View style={styles.pressableInput}>
                      <Text style={[styles.pressableText, !birthDate && styles.placeholderText]}>
                        {birthDate ? birthDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select Date'}
                      </Text>
                    </View>
                  </NeumorphicInset>
                </Pressable>
                <DatePickerModal
                  visible={showBirthDatePicker}
                  onClose={() => setShowBirthDatePicker(false)}
                  onDone={(date) => {
                    setBirthDate(date);
                    setShowBirthDatePicker(false);
                  }}
                  value={birthDate}
                />
              </View>
              <View style={{ flex: 1, marginLeft: theme.spacing.s }}>
                <Text style={[styles.detailLabel, { marginBottom: theme.spacing.s, marginTop: theme.spacing.s }]}>Service Entry Date</Text>
                <Pressable style={{ marginBottom: theme.spacing.s }} onPress={() => setShowServiceEntryDatePicker(true)}>
                  <NeumorphicInset style={{ borderRadius: theme.borderRadius.m }}>
                    <View style={styles.pressableInput}>
                      <Text style={[styles.pressableText, !serviceEntryDate && styles.placeholderText]}>
                        {serviceEntryDate ? serviceEntryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select Date'}
                      </Text>
                    </View>
                  </NeumorphicInset>
                </Pressable>
                <DatePickerModal
                  visible={showServiceEntryDatePicker}
                  onClose={() => setShowServiceEntryDatePicker(false)}
                  onDone={(date) => {
                    setServiceEntryDate(date);
                    setShowServiceEntryDatePicker(false);
                  }}
                  value={serviceEntryDate}
                />
              </View>
            </View>
          )}
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