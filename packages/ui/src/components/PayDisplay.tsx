import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface PayDetail {
  label: string;
  value: number;
}

import { DatePickerModal } from './DatePickerModal';
import { PillButton } from './PillButton';
import { StyledTextInput } from './StyledTextInput';

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
  paySource?: string;
  onHelpPress?: () => void;
  breakInService?: string;
  setBreakInService?: (text: string) => void;
}

export const PayDisplay: React.FC<PayDisplayProps> = ({ annualPay, monthlyPay, payDetails, deductions, containerStyle, federalStandardDeduction, stateStandardDeduction, isStandardDeductionsExpanded, onToggleStandardDeductions, onGetRetirementAge, isRetirementAgeCalculatorVisible, birthDate, setBirthDate, serviceEntryDate, setServiceEntryDate, retirementAge, component, paySource, onHelpPress, breakInService, setBreakInService }) => {
  const { theme } = useTheme();
  const [showBirthDatePicker, setShowBirthDatePicker] = React.useState(false);
  const [showServiceEntryDatePicker, setShowServiceEntryDatePicker] = React.useState(false);

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    totalPayContainer: {
      alignItems: 'center',
      width: '100%',
      marginBottom: theme.spacing.m,
    },
    helpIconContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
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
    monthlyPayRow: {
      marginTop: theme.spacing.s,
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
    columnsContainer: {
      flexDirection: 'row',
      width: '100%',
    },
    leftColumn: {
      flex: 1,
      marginRight: theme.spacing.m,
    },
    rightColumn: {
      flex: 1,
      marginLeft: theme.spacing.m,
    },
    marginTopS: {
      marginTop: theme.spacing.s,
    },
    fullWidthCentered: {
      marginTop: 0,
      width: '100%',
      alignItems: 'center',
    },
    helpfulInfoContainer: {
      marginTop: theme.spacing.m,
      width: '100%',
    },
    fullWidth: {
      marginTop: 0,
      width: '100%',
    },
    retirementCalculatorContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 0,
    },
    datePickerContainer: {
      flex: 1,
      marginRight: theme.spacing.s,
    },
    serviceEntryDatePickerContainer: {
      flex: 1,
      marginLeft: theme.spacing.s,
      marginRight: theme.spacing.s,
    },
    serviceBreakContainer: {
      flex: 1,
      marginLeft: theme.spacing.s,
    },
    dateLabel: {
      marginBottom: theme.spacing.s,
      marginTop: theme.spacing.s,
    },
    marginBottomS: {
      marginBottom: theme.spacing.s,
    },
    serviceBreakInput: {
      textAlign: 'center',
      borderWidth: 0,
      backgroundColor: 'transparent',
      padding: 0,
      borderRadius: 0,
    }
  });

  const renderCurrency = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
    return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderNumber = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
    return value.toLocaleString();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.totalPayContainer}>
        <View style={styles.payRow}>
          <Text style={styles.annualLabel}>ANNUAL: </Text>
          <Text style={styles.totalPayValue}>{renderCurrency(annualPay)}</Text>
        </View>
        <View style={[styles.payRow, styles.monthlyPayRow]}>
          <Text style={styles.totalPayLabel}>MONTHLY: </Text>
          <Text style={styles.detailValue}>{renderCurrency(monthlyPay)}</Text>
        </View>
        {onHelpPress && (
          <Pressable onPress={onHelpPress} style={styles.helpIconContainer}>
            <MaterialCommunityIcons name="help-circle-outline" size={16} color={theme.colors.text} />
          </Pressable>
        )}
      </View>
      <View style={styles.columnsContainer}>
        {/* Left Column: Income */}
        <View style={styles.leftColumn}>
            <Text style={styles.columnHeader}>{paySource === 'Military' ? 'Military Income' : 'Tax-Free Income'}</Text>
            <View style={styles.marginTopS}>
                {payDetails.map((detail, index) => (
                <View key={index} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{detail.label.toUpperCase()}</Text>
                    <Text style={styles.detailValue}>{renderCurrency(detail.value)}</Text>
                </View>
                ))}
            </View>
        </View>
        {/* Right Column: Deductions */}
        <View style={styles.rightColumn}>
            <Text style={styles.columnHeader}>Deductions</Text>
            <View style={styles.marginTopS}>
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
        <View style={styles.fullWidthCentered}>
          <Pressable onPress={onToggleStandardDeductions}>
            <MaterialCommunityIcons name='chevron-down' size={24} color={theme.colors.primary} />
          </Pressable>
        </View>
      )}
      {isStandardDeductionsExpanded && (
        <View style={styles.helpfulInfoContainer}>
          <Text style={styles.columnHeader}>Helpful Info</Text>
          <View style={styles.marginTopS}>
              <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Federal Std Deduction</Text>
                  <Text style={styles.detailValue}>${renderNumber(federalStandardDeduction)}</Text>
              </View>
              <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>State Std Deduction</Text>
                  <Text style={styles.detailValue}>${renderNumber(stateStandardDeduction)}</Text>
              </View>
              {retirementAge !== null && retirementAge !== undefined && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Retirement Age</Text>
                  <Text style={styles.detailValue}>{renderNumber(retirementAge)}</Text>
                </View>
              )}
          </View>
          {onGetRetirementAge && component === 'Active' && (
            <View style={styles.fullWidth}>
              <PillButton title="Get Retirement Age" onPress={onGetRetirementAge} textStyle={theme.typography.bodybold} />
            </View>
          )}
          {isRetirementAgeCalculatorVisible && component === 'Active' && (
            <View style={styles.retirementCalculatorContainer}>
              <View style={styles.datePickerContainer}>
                <Text style={[styles.detailLabel, styles.dateLabel]}>Birth Date</Text>
                <Pressable style={styles.marginBottomS} onPress={() => setShowBirthDatePicker(true)}>
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
                    if (setBirthDate && date) setBirthDate(date);
                    setShowBirthDatePicker(false);
                  }}
                  value={birthDate}
                />
              </View>
              <View style={styles.serviceEntryDatePickerContainer}>
                <Text style={[styles.detailLabel, styles.dateLabel]}>Service Entry Date</Text>
                <Pressable style={styles.marginBottomS} onPress={() => setShowServiceEntryDatePicker(true)}>
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
                    if (setServiceEntryDate && date) setServiceEntryDate(date);
                    setShowServiceEntryDatePicker(false);
                  }}
                  value={serviceEntryDate}
                />
              </View>
              <View style={styles.serviceBreakContainer}>
                <Text style={[styles.detailLabel, styles.dateLabel]}>Service Break</Text>
                <NeumorphicInset style={{ borderRadius: theme.borderRadius.m, marginBottom: theme.spacing.s }}>
                  <View style={styles.pressableInput}>
                    <StyledTextInput
                      keyboardType="number-pad"
                      value={breakInService || ''}
                      onChangeText={setBreakInService}
                      placeholder="Years"
                      style={[
                        styles.pressableText,
                        styles.serviceBreakInput
                      ]}
                    />
                  </View>
                </NeumorphicInset>
              </View>
            </View>
          )}
          <View style={styles.fullWidthCentered}>
            <Pressable onPress={onToggleStandardDeductions}>
              <MaterialCommunityIcons name='chevron-up' size={24} color={theme.colors.primary} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};