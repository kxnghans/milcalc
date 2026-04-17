import {
  DatePickerModal,
  NeumorphicInset,
  PillButton,
  StyledTextInput,
  useTheme,
} from "@repo/ui";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import NumberInput from "../NumberInput";
import { LabelWithHelp } from "./RetirementUiComponents";

interface RetirementAgeProps {
  isRetirementAgeCalculatorVisible: boolean;
  setIsRetirementAgeCalculatorVisible: (value: boolean) => void;
  retirementAge: string | number | null;
  birthDate: Date | null;
  setBirthDate: ((value: Date) => void) | undefined;
  serviceEntryDate: Date | null;
  setServiceEntryDate: ((value: Date) => void) | undefined;
  breakInService: string | undefined;
  setBreakInService: ((value: string) => void) | undefined;
  showServicePoints: boolean;
  servicePoints: string;
  setServicePoints: (value: string) => void;
  showGoodYears: boolean;
  goodYears: string;
  setGoodYears: (value: string) => void;
  handleOpenHelp: (key: string) => void;
}

export const RetirementAge: React.FC<RetirementAgeProps> = ({
  isRetirementAgeCalculatorVisible,
  setIsRetirementAgeCalculatorVisible,
  retirementAge,
  birthDate,
  setBirthDate,
  serviceEntryDate,
  setServiceEntryDate,
  breakInService,
  setBreakInService,
  showServicePoints,
  servicePoints,
  setServicePoints,
  showGoodYears,
  goodYears,
  setGoodYears,
  handleOpenHelp,
}) => {
  const { theme } = useTheme();

  const [showBirthDatePicker, setShowBirthDatePicker] = React.useState(false);
  const [showEntryDatePicker, setShowEntryDatePicker] = React.useState(false);

  const styles = StyleSheet.create({
    fieldRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.m,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.m,
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
    retirementAgeActionContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginLeft: theme.spacing.s,
    },
    retirementAgePillButton: {
      paddingHorizontal: theme.spacing.s,
      paddingVertical: theme.spacing.xs,
      flexShrink: 1,
    },
    retirementAgeDisplayContainer: {
      marginLeft: theme.spacing.s,
      minWidth: 40,
    },
    retirementAgeDisplay: {
      ...theme.typography.subtitle,
      color: theme.colors.primary,
      fontWeight: "bold",
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
    birthDatePickerColumn: {
      flex: 1.25,
      marginRight: theme.spacing.s,
    },
    entryDatePickerColumn: {
      flex: 1.25,
      marginRight: theme.spacing.s,
    },
    serviceBreakColumn: {
      flex: 1,
    },
    pressableInput: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      height: 48,
    },
    pressableText: {
      ...theme.typography.bodybold,
      color: theme.colors.text,
      textAlign: "center",
    },
    placeholderText: {
      color: theme.colors.disabled,
    },
    serviceBreakInput: {
      textAlign: "center",
      paddingVertical: 0,
    },
    marginHorizontalS: {
      marginLeft: theme.spacing.s,
    },
  });

  return (
    <>
      <View style={styles.fieldRow}>
        <LabelWithHelp
          label="Retirement Age"
          contentKey="Retirement Age"
          onPress={handleOpenHelp}
          style={styles.labelRow}
          textStyle={styles.labelHelpText}
          iconColor={theme.colors.disabled}
        />
        <View style={styles.retirementAgeActionContainer}>
          <PillButton
            title={
              isRetirementAgeCalculatorVisible
                ? "Hide Calculator"
                : "Calculate Retirement Age"
            }
            onPress={() =>
              setIsRetirementAgeCalculatorVisible(
                !isRetirementAgeCalculatorVisible,
              )
            }
            backgroundColor={
              isRetirementAgeCalculatorVisible
                ? theme.colors.disabled
                : theme.colors.primary
            }
            style={styles.retirementAgePillButton}
            textStyle={theme.typography.bodybold}
          />
          <View style={styles.retirementAgeDisplayContainer}>
            <Text style={styles.retirementAgeDisplay}>{retirementAge}</Text>
          </View>
        </View>
      </View>

      {isRetirementAgeCalculatorVisible && (
        <View style={styles.row}>
          <View style={styles.birthDatePickerColumn}>
            <Text
              style={[
                styles.boldLabel,
                styles.centerLabel,
                styles.boldLabelNoMargin,
              ]}
            >
              Birth Date
            </Text>
            <Pressable onPress={() => setShowBirthDatePicker(true)}>
              <NeumorphicInset
                containerStyle={{ borderRadius: theme.borderRadius.m }}
                contentStyle={styles.pressableInput}
              >
                <Text
                  style={[
                    styles.pressableText,
                    !birthDate && styles.placeholderText,
                  ]}
                >
                  {birthDate
                    ? birthDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Select..."}
                </Text>
              </NeumorphicInset>
            </Pressable>
            <DatePickerModal
              visible={showBirthDatePicker}
              onClose={() => setShowBirthDatePicker(false)}
              onDone={(date) => {
                if (setBirthDate && date) setBirthDate(date);
                setShowBirthDatePicker(false);
              }}
              value={birthDate || undefined}
            />
          </View>
          <View style={styles.entryDatePickerColumn}>
            <Text
              style={[
                styles.boldLabel,
                styles.centerLabel,
                styles.boldLabelNoMargin,
              ]}
            >
              Entry Date
            </Text>
            <Pressable onPress={() => setShowEntryDatePicker(true)}>
              <NeumorphicInset
                containerStyle={{ borderRadius: theme.borderRadius.m }}
                contentStyle={styles.pressableInput}
              >
                <Text
                  style={[
                    styles.pressableText,
                    !serviceEntryDate && styles.placeholderText,
                  ]}
                >
                  {serviceEntryDate
                    ? serviceEntryDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Select..."}
                </Text>
              </NeumorphicInset>
            </Pressable>
            <DatePickerModal
              visible={showEntryDatePicker}
              onClose={() => setShowEntryDatePicker(false)}
              onDone={(date) => {
                if (setServiceEntryDate && date) setServiceEntryDate(date);
                setShowEntryDatePicker(false);
              }}
              value={serviceEntryDate || undefined}
            />
          </View>
          <View style={styles.serviceBreakColumn}>
            <Text
              style={[
                styles.boldLabel,
                styles.centerLabel,
                styles.boldLabelNoMargin,
              ]}
            >
              Break (Yrs)
            </Text>
            <NeumorphicInset
              containerStyle={{ borderRadius: theme.borderRadius.m }}
              contentStyle={styles.pressableInput}
            >
              <StyledTextInput
                keyboardType="number-pad"
                value={breakInService || ""}
                onChangeText={setBreakInService}
                placeholder="0"
                style={[styles.pressableText, styles.serviceBreakInput]}
              />
            </NeumorphicInset>
          </View>
        </View>
      )}
      {showServicePoints && (
        <View style={styles.fieldRow}>
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
            onChangeText={setServicePoints}
            style={styles.marginHorizontalS}
          />
        </View>
      )}
      {showGoodYears && (
        <View style={styles.fieldRow}>
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
            onChangeText={setGoodYears}
            style={styles.marginHorizontalS}
          />
        </View>
      )}
    </>
  );
};
