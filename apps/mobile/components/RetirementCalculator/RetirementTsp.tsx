import {
  LabelWithHelp,
  PillButton,
  SegmentedSelector,
  useTheme,
} from "@repo/ui";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import CurrencyInput from "../CurrencyInput";
import NumberInput from "../NumberInput";
import PickerInput from "../PickerInput";

export const tspTypeOptions = [
  { label: "Roth", value: "Roth" },
  { label: "Traditional", value: "Traditional" },
];

export const tspReturnOptions = Array.from({ length: 51 }, (_, i) => ({
  label: `${i}%`,
  value: i,
}));

interface RetirementTspProps {
  tspType: string;
  setTspType: (value: string) => void;
  tspAmount: string;
  setTspAmount: (value: string) => void;
  isTspCalculatorVisible: boolean;
  setIsTspCalculatorVisible: (value: boolean) => void;
  tspContributionAmount: string;
  setTspContributionAmount: (value: string) => void;
  tspContributionPercentage: string;
  setTspContributionPercentage: (value: string) => void;
  tspContributionYears: string;
  setTspContributionYears: (value: string) => void;
  tspReturn: number;
  setTspReturn: (value: number) => void;
  handleOpenHelp: (key: string) => void;
}

export const RetirementTsp: React.FC<RetirementTspProps> = ({
  tspType,
  setTspType,
  tspAmount,
  setTspAmount,
  isTspCalculatorVisible,
  setIsTspCalculatorVisible,
  tspContributionAmount,
  setTspContributionAmount,
  tspContributionPercentage,
  setTspContributionPercentage,
  tspContributionYears,
  setTspContributionYears,
  tspReturn,
  setTspReturn,
  handleOpenHelp,
}) => {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // Vertical field block
        fieldBlock: {
          marginBottom: theme.spacing.m,
        },
        // Label row: LabelWithHelp + SegmentedSelector side by side
        tspLabelRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: theme.spacing.s,
        },
        labelRow: {
          flexDirection: "row",
          alignItems: "center",
        },
        labelHelpText: {
          ...theme.typography.subtitle,
          color: theme.colors.text,
          marginRight: theme.spacing.xs,
        },
        // TSP type selector — fixed width next to label
        tspTypeSelector: {
          flex: 1,
          marginLeft: theme.spacing.s,
        },
        // Input row: CurrencyInput fills space, PillButton on right
        tspInputRow: {
          flexDirection: "row",
          alignItems: "center",
        },
        tspAmountInput: {
          flex: 1,
        },
        tspPillButton: {
          paddingHorizontal: theme.spacing.s,
          paddingVertical: theme.spacing.xs,
          flexShrink: 0,
          marginLeft: theme.spacing.s,
        },
        // TSP calculator expanded row
        calculatorRow: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: theme.spacing.m,
        },
        boldLabel: {
          ...theme.typography.subtitle,
          color: theme.colors.text,
          marginBottom: theme.spacing.s,
        },
        boldLabelNoMargin: {
          marginBottom: 0,
        },
        centerLabel: {
          textAlign: "center",
        },
        avgSalaryColumn: {
          flex: 1.5,
          marginRight: theme.spacing.s,
        },
        contPercentageColumn: {
          flex: 1,
          marginRight: theme.spacing.s,
        },
        contYearsColumn: {
          flex: 1,
          marginRight: theme.spacing.s,
        },
        returnColumn: {
          flex: 1,
        },
      }),
    [theme],
  );

  return (
    <>
      {/* TSP section — label+toggle on top row, input+button on bottom row */}
      <View style={styles.fieldBlock}>
        {/* Row 1: "TSP ?" label + Roth/Traditional toggle */}
        <View style={styles.tspLabelRow}>
          <LabelWithHelp
            label="TSP"
            contentKey="TSP"
            onPress={handleOpenHelp}
            style={styles.labelRow}
            textStyle={styles.labelHelpText}
            iconColor={theme.colors.disabled}
          />
          <SegmentedSelector
            style={styles.tspTypeSelector}
            options={tspTypeOptions}
            selectedValues={[tspType]}
            onValueChange={(value) => setTspType(value)}
          />
        </View>

        {/* Row 2: Currency input + Calculate pill button */}
        <View style={styles.tspInputRow}>
          <CurrencyInput
            style={styles.tspAmountInput}
            placeholder="0.00"
            value={tspAmount}
            onChangeText={setTspAmount}
            editable={!isTspCalculatorVisible}
          />
          <PillButton
            title={isTspCalculatorVisible ? "Input TSP" : "Calculate TSP"}
            onPress={() => setIsTspCalculatorVisible(!isTspCalculatorVisible)}
            backgroundColor={
              isTspCalculatorVisible
                ? theme.colors.disabled
                : theme.colors.primary
            }
            style={styles.tspPillButton}
            textStyle={theme.typography.bodybold}
          />
        </View>
      </View>

      {/* Expanded TSP calculator: Avg Salary / Cont.% / Years / Return */}
      {isTspCalculatorVisible && (
        <View style={styles.calculatorRow}>
          <View style={styles.avgSalaryColumn}>
            <Text
              style={[
                styles.boldLabel,
                styles.centerLabel,
                styles.boldLabelNoMargin,
              ]}
            >
              Avg Salary
            </Text>
            <CurrencyInput
              placeholder="0.00"
              value={tspContributionAmount}
              onChangeText={setTspContributionAmount}
            />
          </View>
          <View style={styles.contPercentageColumn}>
            <Text
              style={[
                styles.boldLabel,
                styles.centerLabel,
                styles.boldLabelNoMargin,
              ]}
            >
              Cont. %
            </Text>
            <NumberInput
              placeholder="0"
              value={tspContributionPercentage}
              onChangeText={setTspContributionPercentage}
            />
          </View>
          <View style={styles.contYearsColumn}>
            <Text
              style={[
                styles.boldLabel,
                styles.centerLabel,
                styles.boldLabelNoMargin,
              ]}
            >
              Years
            </Text>
            <NumberInput
              placeholder="0"
              value={tspContributionYears}
              onChangeText={setTspContributionYears}
            />
          </View>
          <View style={styles.returnColumn}>
            <Text
              style={[
                styles.boldLabel,
                styles.centerLabel,
                styles.boldLabelNoMargin,
              ]}
            >
              Return
            </Text>
            <PickerInput
              items={tspReturnOptions}
              selectedValue={tspReturn}
              onValueChange={(val) => setTspReturn(val as number)}
              placeholder="Select..."
            />
          </View>
        </View>
      )}
    </>
  );
};
