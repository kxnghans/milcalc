import { SegmentedSelector, useTheme } from "@repo/ui";
import { getAlphaColor } from "@repo/ui";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import NumberInput from "../NumberInput";
import PickerInput from "../PickerInput";
import TwoColumnPicker from "../TwoColumnPicker";
import VerticalDivider from "../VerticalDivider";

interface PayDemographicsProps {
  component: string;
  setComponent: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  rank: string | null;
  setRank: (value: string | number | null) => void;
  yearsOfService: string;
  setYearsOfService: (value: string) => void;
  filteredRanks: { label: string; value: string }[];
  filingStatus: string;
  setFilingStatus: (value: string) => void;
  bahDependencyStatus: string;
  setBahDependencyStatus: (value: string) => void;
  mhaData: Record<
    string,
    { label: string; value: string | number | null }[]
  > | null;
  mha: string;
  handleMhaChange: (value: string | number | null, primary: string) => void;
  mhaDisplayName: string;
  isLoading: boolean;
  mhaError: unknown;
  state: string;
  disabilityPickerData: Record<
    string,
    { label: string; value: string | number | null }[]
  > | null;
  vaDependencyStatus: string | null;
  handleDisabilityChange: (
    value: string | number | null,
    primary: string,
  ) => void;
  disabilityDisplayName: string;
  disabilityError: unknown;
  disabilityPercentage: string | null;
  disabilityPercentageItems: string[];
}

export const PayDemographics: React.FC<PayDemographicsProps> = ({
  component,
  setComponent,
  status,
  setStatus,
  rank,
  setRank,
  yearsOfService,
  setYearsOfService,
  filteredRanks,
  filingStatus,
  setFilingStatus,
  bahDependencyStatus,
  setBahDependencyStatus,
  mhaData,
  mha,
  handleMhaChange,
  mhaDisplayName,
  isLoading,
  mhaError,
  state,
  disabilityPickerData,
  vaDependencyStatus,
  handleDisabilityChange,
  disabilityDisplayName,
  disabilityError,
  disabilityPercentage,
  disabilityPercentageItems,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
    },
    leftColumn: {
      flex: 1.1,
    },
    rightColumn: {
      flex: 0.9,
      paddingRight: theme.spacing.s,
    },
    fieldRow: {
      marginBottom: theme.spacing.m,
    },
    boldLabel: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
    verticalDivider: {
      marginHorizontal: theme.spacing.m,
      backgroundColor: getAlphaColor("#000000", 0.01),
    },
    marginBottomS: {
      marginBottom: theme.spacing.s,
    },
    noMarginBottom: {
      marginBottom: 0,
    },
    noMarginTopBottom: {
      marginTop: 0,
      marginBottom: 0,
    },
    noMarginHorizontal: {
      marginLeft: 0,
      marginRight: 0,
    },
    marginTopS: {
      marginTop: theme.spacing.s,
    },
  });

  return (
    <View style={styles.container}>
      {/* Left Column */}
      <View style={styles.leftColumn}>
        <View style={[styles.fieldRow, styles.marginBottomS]}>
          <Text style={[styles.boldLabel, styles.noMarginBottom]}>
            Component
          </Text>
          <SegmentedSelector
            options={[
              { label: "Active", value: "Active" },
              { label: "Guard", value: "Guard" },
              { label: "Reserve", value: "Reserve" },
            ]}
            ratios={[4, 4, 5]}
            selectedValues={[component]}
            onValueChange={(value) => setComponent(value)}
            style={styles.noMarginHorizontal}
          />
        </View>
        <View style={[styles.fieldRow, styles.marginBottomS]}>
          <Text style={[styles.boldLabel, styles.noMarginBottom]}>Status</Text>
          <SegmentedSelector
            options={[
              { label: "Enlisted", value: "Enlisted" },
              { label: "WO", value: "Warrant Officer" },
              { label: "Officer", value: "Officer" },
            ]}
            ratios={[5, 2.75, 4]}
            selectedValues={[status]}
            onValueChange={(value) => setStatus(value)}
            style={styles.noMarginHorizontal}
          />
        </View>
        <View style={styles.fieldRow} collapsable={false}>
          <Text style={styles.boldLabel}>Pay Grade</Text>
          <PickerInput
            items={filteredRanks}
            selectedValue={rank}
            onValueChange={setRank}
            placeholder="Select..."
          />
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.boldLabel}>Years of Service</Text>
          <NumberInput
            placeholder="0"
            value={yearsOfService}
            onChangeText={setYearsOfService}
          />
        </View>
      </View>

      <VerticalDivider style={styles.verticalDivider} />

      {/* Right Column */}
      <View style={styles.rightColumn}>
        <View style={[styles.fieldRow, styles.marginBottomS]}>
          <Text style={[styles.boldLabel, styles.noMarginBottom]}>
            Tax Filing Status
          </Text>
          <SegmentedSelector
            options={[
              { label: "Single", value: "single" },
              { label: "Married", value: "married" },
            ]}
            selectedValues={[filingStatus]}
            onValueChange={(value) => setFilingStatus(value)}
            style={styles.noMarginHorizontal}
          />
        </View>
        <View style={[styles.fieldRow, styles.noMarginBottom]}>
          <Text style={[styles.boldLabel, styles.noMarginTopBottom]}>
            Dependents
          </Text>
          <SegmentedSelector
            options={[
              { label: "No", value: "WITHOUT_DEPENDENTS" },
              { label: "Yes", value: "WITH_DEPENDENTS" },
            ]}
            selectedValues={[bahDependencyStatus]}
            onValueChange={(value) => setBahDependencyStatus(value)}
            style={styles.noMarginHorizontal}
          />
        </View>
        <View style={[styles.fieldRow, styles.marginTopS]}>
          <Text style={styles.boldLabel}>Mil Housing Area</Text>
          <TwoColumnPicker
            data={mhaData}
            selectedValue={mha}
            onChange={handleMhaChange}
            displayName={mhaDisplayName}
            isLoading={isLoading}
            error={mhaError}
            primaryColumnValue={state}
            secondaryPlaceholder="Select a location"
          />
        </View>
        <View style={[styles.fieldRow, styles.marginTopS]}>
          <Text style={styles.boldLabel}>VA Disability</Text>
          <TwoColumnPicker
            data={disabilityPickerData}
            selectedValue={vaDependencyStatus}
            onChange={handleDisabilityChange}
            displayName={disabilityDisplayName}
            isLoading={isLoading}
            error={disabilityError}
            primaryColumnValue={disabilityPercentage}
            primaryItems={disabilityPercentageItems}
            primaryPlaceholder="..."
            secondaryPlaceholder="Select disability rating"
            primarySort={(a, b) =>
              Number(a.replace("%", "")) - Number(b.replace("%", ""))
            }
          />
        </View>
      </View>
    </View>
  );
};

export default PayDemographics;
