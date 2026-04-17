import { PillButton, useTheme } from "@repo/ui";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import CurrencyInput from "../CurrencyInput";
import InsetTextInput from "../InsetTextInput";
import {
  AddButton,
  CancelButton,
  NewLabelWithHelp,
  RoundIconButton,
} from "./PayUiComponents";

interface DeductionsState {
  sgli: string;
  tsp: string;
  overrideFedTax: string;
  overrideStateTax: string;
  overrideFicaTax: string;
}

interface AdditionalDeduction {
  name: string;
  amount: string;
}

interface PayDeductionsProps {
  isDeductionsExpanded: boolean;
  toggleDeductions: () => void;
  isTaxOverride: boolean;
  setIsTaxOverride: (value: boolean) => void;
  deductions: DeductionsState;
  setDeductions: React.Dispatch<React.SetStateAction<DeductionsState>>;
  additionalDeductions: AdditionalDeduction[];
  setAdditionalDeductions: React.Dispatch<
    React.SetStateAction<AdditionalDeduction[]>
  >;
  showAddDeductionButton: boolean;
  openDetailModal: (contentKey: string) => void;
}

export default function PayDeductions({
  isDeductionsExpanded,
  toggleDeductions,
  isTaxOverride,
  setIsTaxOverride,
  deductions,
  setDeductions,
  additionalDeductions,
  setAdditionalDeductions,
  showAddDeductionButton,
  openDetailModal,
}: PayDeductionsProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    fieldRow: {
      marginBottom: theme.spacing.m,
    },
    boldLabel: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
    expandableHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    expandableContent: {
      overflow: "hidden",
      marginTop: theme.spacing.s,
    },
    divider: {
      marginVertical: theme.spacing.s,
    },
    expandableContentNoTopMargin: {
      marginTop: 0,
    },
    centeredItems: {
      alignItems: "center",
    },
    additionalIncomeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    flex1: {
      flex: 1,
    },
    marginRightS: {
      marginRight: theme.spacing.s,
    },
    marginHorizontalS: {
      marginLeft: theme.spacing.s,
      marginRight: theme.spacing.s,
    },
  });

  return (
    <>
      {/* Deductions Section */}
      <View style={styles.fieldRow}>
        <Pressable onPress={toggleDeductions} style={styles.expandableHeader}>
          <Text style={styles.boldLabel}>Deductions</Text>
          <RoundIconButton
            onPress={toggleDeductions}
            iconName={isDeductionsExpanded ? "chevron-up" : "chevron-down"}
            backgroundColor={theme.colors.primary}
            iconSize={18}
          />
        </Pressable>
        {isDeductionsExpanded && (
          <View
            style={[
              styles.expandableContent,
              styles.expandableContentNoTopMargin,
            ]}
          >
            <View style={styles.centeredItems}>
              <PillButton
                title={
                  isTaxOverride ? "Use Calculated Taxes" : "Override Taxes"
                }
                onPress={() => setIsTaxOverride(!isTaxOverride)}
                textStyle={theme.typography.subtitle}
              />
            </View>

            {isTaxOverride && (
              <>
                <View style={styles.fieldRow}>
                  <NewLabelWithHelp
                    label="Federal Tax"
                    contentKey="Federal Tax"
                    onHelpPress={openDetailModal}
                  />
                  <CurrencyInput
                    placeholder="0.00"
                    value={deductions.overrideFedTax}
                    onChangeText={(text) =>
                      setDeductions((d) => ({ ...d, overrideFedTax: text }))
                    }
                  />
                </View>
                <View style={styles.fieldRow}>
                  <NewLabelWithHelp
                    label="State Tax"
                    contentKey="State Tax"
                    onHelpPress={openDetailModal}
                  />
                  <CurrencyInput
                    placeholder="0.00"
                    value={deductions.overrideStateTax}
                    onChangeText={(text) =>
                      setDeductions((d) => ({ ...d, overrideStateTax: text }))
                    }
                  />
                </View>
                <View style={styles.fieldRow}>
                  <NewLabelWithHelp
                    label="FICA"
                    contentKey="FICA"
                    onHelpPress={openDetailModal}
                  />
                  <CurrencyInput
                    placeholder="0.00"
                    value={deductions.overrideFicaTax}
                    onChangeText={(text) =>
                      setDeductions((d) => ({ ...d, overrideFicaTax: text }))
                    }
                  />
                </View>
              </>
            )}

            <View style={styles.fieldRow}>
              <NewLabelWithHelp
                label="SGLI"
                contentKey="Servicemembers' Group Life Insurance (SGLI)"
                onHelpPress={openDetailModal}
              />
              <CurrencyInput
                placeholder="0.00"
                value={deductions.sgli}
                onChangeText={(text) =>
                  setDeductions((d) => ({ ...d, sgli: text }))
                }
              />
            </View>
            <View style={styles.fieldRow}>
              <NewLabelWithHelp
                label="TSP"
                contentKey="Thrift Savings Plan (TSP)"
                onHelpPress={openDetailModal}
              />
              <CurrencyInput
                placeholder="0.00"
                value={deductions.tsp}
                onChangeText={(text) =>
                  setDeductions((d) => ({ ...d, tsp: text }))
                }
              />
            </View>

            <NewLabelWithHelp
              label="Additional Deductions"
              contentKey="Additional Deductions"
              onHelpPress={openDetailModal}
            />
            {additionalDeductions.map((deduction, index) => (
              <View
                key={index}
                style={[styles.fieldRow, styles.additionalIncomeRow]}
              >
                <View style={[styles.flex1, styles.marginRightS]}>
                  <InsetTextInput
                    placeholder="Description"
                    value={deduction.name}
                    onChangeText={(text) => {
                      const newDeductions = [...additionalDeductions];
                      newDeductions[index].name = text;
                      setAdditionalDeductions(newDeductions);
                    }}
                  />
                </View>
                <View style={[styles.flex1, styles.marginHorizontalS]}>
                  <CurrencyInput
                    placeholder="0.00"
                    value={deduction.amount}
                    onChangeText={(text) => {
                      const newDeductions = [...additionalDeductions];
                      newDeductions[index].amount = text;
                      setAdditionalDeductions(newDeductions);
                    }}
                  />
                </View>
                {(deduction.name || deduction.amount) && (
                  <CancelButton
                    onPress={() => {
                      const newDeductions = [...additionalDeductions];
                      if (newDeductions.length > 1) {
                        newDeductions.splice(index, 1);
                      } else {
                        newDeductions[index] = { name: "", amount: "" };
                      }
                      setAdditionalDeductions(newDeductions);
                    }}
                  />
                )}
              </View>
            ))}
            {showAddDeductionButton && (
              <AddButton
                onPress={() =>
                  setAdditionalDeductions((d) => [
                    ...d,
                    { name: "", amount: "" },
                  ])
                }
              />
            )}
          </View>
        )}
      </View>
    </>
  );
}
