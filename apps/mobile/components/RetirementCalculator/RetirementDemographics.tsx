import { LabelWithHelp, SegmentedSelector, useTheme } from "@repo/ui";
import * as Haptics from "expo-haptics";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import NumberInput from "../NumberInput";
import PickerInput from "../PickerInput";
import TwoColumnPicker from "../TwoColumnPicker";

export const componentOptions = [
  { label: "Active", value: "Active" },
  { label: "Reserves", value: "Reserves" },
  { label: "Guard", value: "Guard" },
];
export const componentRatios = [4, 5, 4];
export const retirementSystemOptions = [
  { label: "High 3", value: "High 3" },
  { label: "BRS", value: "BRS" },
];
export const filingStatusOptions = [
  { label: "Single", value: "Single" },
  { label: "Married", value: "Married" },
];

interface RetirementDemographicsProps {
  component: string;
  setComponent: (value: string) => void;
  retirementSystem: string;
  setRetirementSystem: (value: string) => void;
  yearsOfService: string;
  setYearsOfService: (value: string) => void;
  yearsOfServiceNum: number;
  payGradesForYear1Options: { label: string; value: string }[];
  high3PayGrade1: string | null;
  setHigh3PayGrade1: (value: string | null) => void;
  payGradesForYear2Options: { label: string; value: string }[];
  high3PayGrade2: string | null;
  setHigh3PayGrade2: (value: string | null) => void;
  payGradesForYear3Options: { label: string; value: string }[];
  high3PayGrade3: string | null;
  setHigh3PayGrade3: (value: string | null) => void;
  filingStatus: string;
  setFilingStatus: (value: string) => void;
  mhaData: Record<
    string,
    { label: string; value: string | number | null }[]
  > | null;
  mha: string;
  handleMhaChange: (value: string, primary: string) => void;
  mhaDisplayName: string;
  isLoading: boolean;
  mhaError: unknown;
  state: string;
  dependentStatus: string | null;
  handleDisabilityChange: (value: string, primary: string) => void;
  disabilityDisplayName: string;
  disabilityError: unknown;
  disabilityPercentage: string | null;
  disabilityPickerData: Record<
    string,
    { label: string; value: string | number | null }[]
  > | null;
  disabilityPercentageItems: string[];
  qualifyingDeploymentDays: string;
  setQualifyingDeploymentDays: (value: string) => void;
  servicePoints: string;
  setServicePoints: (value: string) => void;
  goodYears: string;
  setGoodYears: (value: string) => void;
  handleOpenHelp: (key: string) => void;
}

export const RetirementDemographics: React.FC<RetirementDemographicsProps> = ({
  component,
  setComponent,
  retirementSystem,
  setRetirementSystem,
  yearsOfService,
  setYearsOfService,
  yearsOfServiceNum,
  payGradesForYear1Options,
  high3PayGrade1,
  setHigh3PayGrade1,
  payGradesForYear2Options,
  high3PayGrade2,
  setHigh3PayGrade2,
  payGradesForYear3Options,
  high3PayGrade3,
  setHigh3PayGrade3,
  filingStatus,
  setFilingStatus,
  mhaData,
  mha,
  handleMhaChange,
  mhaDisplayName,
  isLoading,
  mhaError,
  state,
  dependentStatus,
  handleDisabilityChange,
  disabilityDisplayName,
  disabilityError,
  disabilityPercentage,
  disabilityPickerData,
  disabilityPercentageItems,
  qualifyingDeploymentDays,
  setQualifyingDeploymentDays,
  servicePoints,
  setServicePoints,
  goodYears,
  setGoodYears,
  handleOpenHelp,
}) => {
  const { theme } = useTheme();

  const handleValidatedChange = (
    text: string,
    setter: (val: string) => void,
  ) => {
    const sanitized = text.replace(/[^0-9]/g, "");
    if (text !== sanitized) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setter(sanitized);
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // Vertical field block: label stacks above full-width input
        fieldBlock: {
          marginBottom: theme.spacing.m,
        },
        // Label row with help icon — horizontal label + icon inline
        labelRow: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: theme.spacing.s,
        },
        labelHelpText: {
          ...theme.typography.subtitle,
          color: theme.colors.text,
          marginRight: theme.spacing.xs,
        },
        boldLabel: {
          ...theme.typography.subtitle,
          color: theme.colors.text,
          marginBottom: theme.spacing.s,
        },
        // Three-column picker row
        pickerRow: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: theme.spacing.m,
        },
        yearColumn: {
          flex: 1,
          marginRight: theme.spacing.s,
        },
        lastYearColumn: {
          flex: 1,
        },
        boldLabelNoMargin: {
          marginBottom: 0,
        },
        centerLabel: {
          textAlign: "center",
        },
        segmentedSpacing: {
          marginBottom: theme.spacing.m,
        },
      }),
    [theme],
  );

  return (
    <>
      {/* Component selector: Active / Reserves / Guard */}
      <SegmentedSelector
        options={componentOptions}
        ratios={componentRatios}
        selectedValues={[component]}
        onValueChange={(value) => setComponent(value)}
        style={styles.segmentedSpacing}
      />

      {/* Retirement system selector: High 3 / BRS */}
      <SegmentedSelector
        options={retirementSystemOptions}
        selectedValues={[retirementSystem]}
        onValueChange={(value) => setRetirementSystem(value)}
        style={styles.segmentedSpacing}
      />

      {/* Years of Service — vertical stack */}
      <View style={styles.fieldBlock}>
        <LabelWithHelp
          label="Years of Service"
          contentKey="High-3"
          onPress={handleOpenHelp}
          style={styles.labelRow}
          textStyle={styles.labelHelpText}
          iconColor={theme.colors.disabled}
        />
        <NumberInput
          placeholder="0"
          value={yearsOfService}
          onChangeText={(text) =>
            handleValidatedChange(text, setYearsOfService)
          }
        />
      </View>

      {/* Reserve / Guard conditional fields */}
      {(component === "Reserves" || component === "Guard") && (
        <>
          <View style={styles.fieldBlock}>
            <LabelWithHelp
              label="Service Points"
              contentKey="Service Points"
              onPress={handleOpenHelp}
              style={styles.labelRow}
              textStyle={styles.labelHelpText}
              iconColor={theme.colors.disabled}
            />
            <NumberInput
              placeholder="0"
              value={servicePoints}
              onChangeText={(text) =>
                handleValidatedChange(text, setServicePoints)
              }
            />
          </View>
          <View style={styles.fieldBlock}>
            <LabelWithHelp
              label="Good Years"
              contentKey="Good Years"
              onPress={handleOpenHelp}
              style={styles.labelRow}
              textStyle={styles.labelHelpText}
              iconColor={theme.colors.disabled}
            />
            <NumberInput
              placeholder="0"
              value={goodYears}
              onChangeText={(text) => handleValidatedChange(text, setGoodYears)}
            />
          </View>
          <View style={styles.fieldBlock}>
            <LabelWithHelp
              label="Qualifying Deployment Days"
              contentKey="Qualifying Deployment Days"
              onPress={handleOpenHelp}
              style={styles.labelRow}
              textStyle={styles.labelHelpText}
              iconColor={theme.colors.disabled}
            />
            <NumberInput
              placeholder="0"
              value={qualifyingDeploymentDays}
              onChangeText={(text) =>
                handleValidatedChange(text, setQualifyingDeploymentDays)
              }
            />
          </View>
        </>
      )}

      {/* Year -2 / Year -1 / Final Year — three-column row */}
      <View style={styles.pickerRow}>
        <View style={styles.yearColumn}>
          <Text
            style={[
              styles.boldLabel,
              styles.centerLabel,
              styles.boldLabelNoMargin,
            ]}
          >
            Year -2
          </Text>
          <PickerInput
            items={payGradesForYear1Options}
            selectedValue={high3PayGrade1}
            onValueChange={(val) => setHigh3PayGrade1(val as string | null)}
            placeholder="Select..."
            disabled={yearsOfServiceNum < 3}
          />
        </View>
        <View style={styles.yearColumn}>
          <Text
            style={[
              styles.boldLabel,
              styles.centerLabel,
              styles.boldLabelNoMargin,
            ]}
          >
            Year -1
          </Text>
          <PickerInput
            items={payGradesForYear2Options}
            selectedValue={high3PayGrade2}
            onValueChange={(val) => setHigh3PayGrade2(val as string | null)}
            placeholder="Select..."
            disabled={yearsOfServiceNum < 3}
          />
        </View>
        <View style={styles.lastYearColumn}>
          <Text
            style={[
              styles.boldLabel,
              styles.centerLabel,
              styles.boldLabelNoMargin,
            ]}
          >
            Final Year
          </Text>
          <PickerInput
            items={payGradesForYear3Options}
            selectedValue={high3PayGrade3}
            onValueChange={(val) => setHigh3PayGrade3(val as string | null)}
            placeholder="Select..."
            disabled={yearsOfServiceNum < 3}
          />
        </View>
      </View>

      {/* Filing Status — vertical stack */}
      <View style={styles.fieldBlock}>
        <Text style={styles.boldLabel}>Filing Status</Text>
        <SegmentedSelector
          options={filingStatusOptions}
          selectedValues={[filingStatus]}
          onValueChange={(value) => setFilingStatus(value)}
        />
      </View>

      {/* MHA — vertical stack */}
      <View style={styles.fieldBlock}>
        <Text style={styles.boldLabel}>MHA</Text>
        <TwoColumnPicker
          data={mhaData || null}
          selectedValue={mha}
          onChange={(val, prim) => handleMhaChange(val as string, prim)}
          displayName={mhaDisplayName}
          isLoading={isLoading}
          error={mhaError}
          primaryColumnValue={state}
          secondaryPlaceholder="Select a location"
        />
      </View>

      {/* VA Disability — vertical stack */}
      <View style={styles.fieldBlock}>
        <Text style={styles.boldLabel}>VA Disability</Text>
        <TwoColumnPicker
          data={
            disabilityPickerData as Record<
              string,
              { label: string; value: string | number | null }[]
            > | null
          }
          selectedValue={dependentStatus}
          onChange={(val, prim) => handleDisabilityChange(val as string, prim)}
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
    </>
  );
};
