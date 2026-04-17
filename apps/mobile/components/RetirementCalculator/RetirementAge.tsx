import {
  DatePickerModal,
  LabelWithHelp,
  NeumorphicInset,
  PillButton,
  StyledTextInput,
  useTheme,
} from "@repo/ui";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
  handleOpenHelp,
}) => {
  const { theme } = useTheme();

  const [showBirthDatePicker, setShowBirthDatePicker] = React.useState(false);
  const [showEntryDatePicker, setShowEntryDatePicker] = React.useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // Header row: label+help left | pill button right
        headerRow: {
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
        pillButton: {
          paddingHorizontal: theme.spacing.s,
          paddingVertical: theme.spacing.xs,
          flexShrink: 1,
        },
        // Calculated age display — shown below the header row
        retirementAgeDisplay: {
          ...theme.typography.subtitle,
          color: theme.colors.primary,
          fontWeight: "bold",
          textAlign: "right",
          marginBottom: theme.spacing.m,
        },
        // Expanded sub-inputs row: Birth Date | Entry Date | Break (Yrs)
        pickerRow: {
          flexDirection: "row",
          alignItems: "flex-start",
          marginBottom: theme.spacing.m,
        },
        birthDateColumn: {
          flex: 1.25,
          marginRight: theme.spacing.s,
        },
        entryDateColumn: {
          flex: 1.25,
          marginRight: theme.spacing.s,
        },
        breakColumn: {
          flex: 1,
        },
        columnLabel: {
          ...theme.typography.subtitle,
          color: theme.colors.text,
          textAlign: "center",
          marginBottom: theme.spacing.s,
        },
        pressableContent: {
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
        breakInput: {
          textAlign: "center",
          paddingVertical: 0,
        },
      }),
    [theme],
  );

  return (
    <>
      {/* Header: "Retirement Age ?" label on left, pill button on right */}
      <View style={styles.headerRow}>
        <LabelWithHelp
          label="Retirement Age"
          contentKey="Retirement Age"
          onPress={handleOpenHelp}
          style={styles.labelRow}
          textStyle={styles.labelHelpText}
          iconColor={theme.colors.disabled}
        />
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
          style={styles.pillButton}
          textStyle={theme.typography.bodybold}
        />
      </View>

      {/* Calculated age result — shown below header, right-aligned */}
      {retirementAge !== null && retirementAge !== undefined && (
        <Text style={styles.retirementAgeDisplay}>Age: {retirementAge}</Text>
      )}

      {/* Expanded calculator: Birth Date | Entry Date | Break (Yrs) */}
      {isRetirementAgeCalculatorVisible && (
        <View style={styles.pickerRow}>
          {/* Birth Date */}
          <View style={styles.birthDateColumn}>
            <Text style={styles.columnLabel}>Birth Date</Text>
            <Pressable onPress={() => setShowBirthDatePicker(true)}>
              <NeumorphicInset
                containerStyle={{ borderRadius: theme.borderRadius.m }}
                contentStyle={styles.pressableContent}
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

          {/* Entry Date */}
          <View style={styles.entryDateColumn}>
            <Text style={styles.columnLabel}>Entry Date</Text>
            <Pressable onPress={() => setShowEntryDatePicker(true)}>
              <NeumorphicInset
                containerStyle={{ borderRadius: theme.borderRadius.m }}
                contentStyle={styles.pressableContent}
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

          {/* Break in Service (Years) */}
          <View style={styles.breakColumn}>
            <Text style={styles.columnLabel}>Break (Yrs)</Text>
            <NeumorphicInset
              containerStyle={{ borderRadius: theme.borderRadius.m }}
              contentStyle={styles.pressableContent}
            >
              <StyledTextInput
                keyboardType="number-pad"
                value={breakInService || ""}
                onChangeText={setBreakInService}
                placeholder="0"
                style={[styles.pressableText, styles.breakInput]}
              />
            </NeumorphicInset>
          </View>
        </View>
      )}
    </>
  );
};
