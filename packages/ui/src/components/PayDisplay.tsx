import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { useTheme } from "../contexts/ThemeContext";

interface PayDetail {
  label: string;
  value: number;
}

interface PayDisplayProps {
  title?: string;
  annualPay: number;
  monthlyPay: number;
  payDetails: PayDetail[];
  deductions: PayDetail[];
  containerStyle?: StyleProp<ViewStyle>;
  federalStandardDeduction: number;
  stateStandardDeduction: number;
  isStandardDeductionsExpanded: boolean;
  onToggleStandardDeductions: () => void;
  paySource?: string;
  onHelpPress?: () => void;
}

export const PayDisplay: React.FC<PayDisplayProps> = ({
  title,
  annualPay,
  monthlyPay,
  payDetails,
  deductions,
  containerStyle,
  federalStandardDeduction,
  stateStandardDeduction,
  isStandardDeductionsExpanded,
  onToggleStandardDeductions,
  paySource,
  onHelpPress,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
    },
    totalPayContainer: {
      alignItems: "center",
      width: "100%",
      marginBottom: theme.spacing.m,
    },
    helpIconContainer: {
      position: "absolute",
      top: 0,
      right: 0,
    },
    annualLabel: {
      ...theme.typography.title,
      color: theme.colors.primary,
    },
    totalPayLabel: {
      color: theme.colors.text,
      textTransform: "uppercase",
      ...theme.typography.label,
    },
    totalPayValue: {
      ...theme.typography.title,
      color: theme.colors.primary,
    },
    payRow: {
      flexDirection: "row",
      alignItems: "baseline",
    },
    monthlyPayRow: {
      marginTop: theme.spacing.s,
    },
    columnHeader: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
      textTransform: "uppercase",
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.s,
    },
    detailLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    detailValue: {
      ...theme.typography.label,
      fontWeight: "500",
      color: theme.colors.text,
    },
    columnsContainer: {
      flexDirection: "row",
      width: "100%",
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
      width: "100%",
      alignItems: "center",
    },
    helpfulInfoContainer: {
      marginTop: theme.spacing.m,
      width: "100%",
    },
  });

  const renderCurrency = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "N/A";
    }
    return `${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderNumber = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "N/A";
    }
    return value.toLocaleString();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.totalPayContainer}>
        {title && <Text style={styles.columnHeader}>{title}</Text>}
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
            <MaterialCommunityIcons
              name="help-circle-outline"
              size={16}
              color={theme.colors.text}
            />
          </Pressable>
        )}
      </View>
      <View style={styles.columnsContainer}>
        {/* Left Column: Income */}
        <View style={styles.leftColumn}>
          <Text style={styles.columnHeader}>
            {paySource === "Military" ? "Military Income" : "Tax-Free Income"}
          </Text>
          <View style={styles.marginTopS}>
            {payDetails.map((detail, index) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {detail.label.toUpperCase()}
                </Text>
                <Text style={styles.detailValue}>
                  {renderCurrency(detail.value)}
                </Text>
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
                <Text style={styles.detailLabel}>
                  {deduction.label.toUpperCase()}
                </Text>
                <Text style={styles.detailValue}>
                  {renderCurrency(deduction.value)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      {!isStandardDeductionsExpanded && (
        <View style={styles.fullWidthCentered}>
          <Pressable onPress={onToggleStandardDeductions}>
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color={theme.colors.primary}
            />
          </Pressable>
        </View>
      )}
      {isStandardDeductionsExpanded && (
        <View style={styles.helpfulInfoContainer}>
          <Text style={styles.columnHeader}>Helpful Info</Text>
          <View style={styles.marginTopS}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Federal Std Deduction</Text>
              <Text style={styles.detailValue}>
                ${renderNumber(federalStandardDeduction)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>State Std Deduction</Text>
              <Text style={styles.detailValue}>
                ${renderNumber(stateStandardDeduction)}
              </Text>
            </View>
          </View>
          <View style={styles.fullWidthCentered}>
            <Pressable onPress={onToggleStandardDeductions}>
              <MaterialCommunityIcons
                name="chevron-up"
                size={24}
                color={theme.colors.primary}
              />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};
