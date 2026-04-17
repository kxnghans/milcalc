import { LabelWithHelp, useTheme } from "@repo/ui";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import CurrencyInput from "../CurrencyInput";
import InsetTextInput from "../InsetTextInput";
import { AddButton, CancelButton, RoundIconButton } from "./PayUiComponents";

interface SpecialPays {
  clothing: string;
  hostileFire: string;
  imminentDanger: string;
  hazardousDuty: string;
  hardshipDuty: string;
  aviation: string;
  assignment: string;
  careerSea: string;
  healthProfessions: string;
  foreignLanguage: string;
  specialDuty: string;
}

interface AdditionalIncome {
  name: string;
  amount: string;
}

interface PaySpecialDutyProps {
  isIncomeExpanded: boolean;
  toggleIncome: () => void;
  specialPays: SpecialPays;
  setSpecialPays: React.Dispatch<React.SetStateAction<SpecialPays>>;
  additionalIncomes: AdditionalIncome[];
  setAdditionalIncomes: React.Dispatch<
    React.SetStateAction<AdditionalIncome[]>
  >;
  showAddIncomeButton: boolean;
  openDetailModal: (contentKey: string) => void;
}

export const PaySpecialDuty: React.FC<PaySpecialDutyProps> = ({
  isIncomeExpanded,
  toggleIncome,
  specialPays,
  setSpecialPays,
  additionalIncomes,
  setAdditionalIncomes,
  showAddIncomeButton,
  openDetailModal,
}) => {
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
    noMarginBottom: {
      marginBottom: 0,
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
      {/* Special Duty Pay Section */}
      <View style={[styles.fieldRow, styles.noMarginBottom]}>
        <Pressable onPress={toggleIncome} style={styles.expandableHeader}>
          <Text style={styles.boldLabel}>Special Duty Pay</Text>
          <RoundIconButton
            onPress={toggleIncome}
            iconName={isIncomeExpanded ? "chevron-up" : "chevron-down"}
            backgroundColor={theme.colors.primary}
            iconSize={18}
          />
        </Pressable>
        {isIncomeExpanded && (
          <View style={styles.expandableContent}>
            <View style={styles.fieldRow}>
              <LabelWithHelp
                label="Clothing Allowance"
                contentKey="Clothing Allowance"
                onPress={openDetailModal}
              />
              <CurrencyInput
                placeholder="0.00"
                value={specialPays.clothing}
                onChangeText={(text) =>
                  setSpecialPays((p) => ({ ...p, clothing: text }))
                }
              />
            </View>
            <View style={styles.fieldRow}>
              <LabelWithHelp
                label="Hostile Fire Pay"
                contentKey="Hostile Fire Pay (HFP)"
                onPress={openDetailModal}
              />
              <CurrencyInput
                placeholder="0.00"
                value={specialPays.hostileFire}
                onChangeText={(text) =>
                  setSpecialPays((p) => ({ ...p, hostileFire: text }))
                }
              />
            </View>
            <View style={styles.fieldRow}>
              <LabelWithHelp
                label="Imminent Danger Pay"
                contentKey="Imminent Danger Pay (IDP)"
                onPress={openDetailModal}
              />
              <CurrencyInput
                placeholder="0.00"
                value={specialPays.imminentDanger}
                onChangeText={(text) =>
                  setSpecialPays((p) => ({ ...p, imminentDanger: text }))
                }
              />
            </View>
            <View style={styles.fieldRow}>
              <LabelWithHelp
                label="Hazardous Duty Incentive Pay"
                contentKey="Hazardous Duty Incentive Pay (HDIP)"
                onPress={openDetailModal}
              />
              <CurrencyInput
                placeholder="0.00"
                value={specialPays.hazardousDuty}
                onChangeText={(text) =>
                  setSpecialPays((p) => ({ ...p, hazardousDuty: text }))
                }
              />
            </View>
            <View style={styles.fieldRow}>
              <LabelWithHelp
                label="Hardship Duty Pay"
                contentKey="Hardship Duty Pay - Location (HDP-L)"
                onPress={openDetailModal}
              />
              <CurrencyInput
                placeholder="0.00"
                value={specialPays.hardshipDuty}
                onChangeText={(text) =>
                  setSpecialPays((p) => ({ ...p, hardshipDuty: text }))
                }
              />
            </View>
            <View style={styles.fieldRow}>
              <LabelWithHelp
                label="Aviation Incentive Pay"
                contentKey="Aviation Incentive Pays (AvIP)"
                onPress={openDetailModal}
              />
              <CurrencyInput
                placeholder="0.00"
                value={specialPays.aviation}
                onChangeText={(text) =>
                  setSpecialPays((p) => ({ ...p, aviation: text }))
                }
              />
            </View>
            <View style={styles.fieldRow}>
              <LabelWithHelp
                label="Assignment Incentive Pay"
                contentKey="Assignment Incentive Pay (AIP)"
                onPress={openDetailModal}
              />
              <CurrencyInput
                placeholder="0.00"
                value={specialPays.assignment}
                onChangeText={(text) =>
                  setSpecialPays((p) => ({ ...p, assignment: text }))
                }
              />
            </View>
            <View style={styles.fieldRow}>
              <LabelWithHelp
                label="Career Sea Pay"
                contentKey="Career Sea Pay"
                onPress={openDetailModal}
              />
              <CurrencyInput
                placeholder="0.00"
                value={specialPays.careerSea}
                onChangeText={(text) =>
                  setSpecialPays((p) => ({ ...p, careerSea: text }))
                }
              />
            </View>
            <View style={styles.fieldRow}>
              <LabelWithHelp
                label="Health Professions Officers"
                contentKey="Health Professions Special Pays"
                onPress={openDetailModal}
              />
              <CurrencyInput
                placeholder="0.00"
                value={specialPays.healthProfessions}
                onChangeText={(text) =>
                  setSpecialPays((p) => ({ ...p, healthProfessions: text }))
                }
              />
            </View>
            <View style={styles.fieldRow}>
              <LabelWithHelp
                label="Foreign Language Proficiency Bonus"
                contentKey="Foreign Language Proficiency Bonus (FLPB)"
                onPress={openDetailModal}
              />
              <CurrencyInput
                placeholder="0.00"
                value={specialPays.foreignLanguage}
                onChangeText={(text) =>
                  setSpecialPays((p) => ({ ...p, foreignLanguage: text }))
                }
              />
            </View>
            <View style={styles.fieldRow}>
              <LabelWithHelp
                label="Special Duty Assignment Pay"
                contentKey="Special Duty Assignment Pay (SDAP)"
                onPress={openDetailModal}
              />
              <CurrencyInput
                placeholder="0.00"
                value={specialPays.specialDuty}
                onChangeText={(text) =>
                  setSpecialPays((p) => ({ ...p, specialDuty: text }))
                }
              />
            </View>

            <LabelWithHelp
              label="Additional Income"
              contentKey="Additional Income"
              onPress={openDetailModal}
            />
            {additionalIncomes.map((income, index) => (
              <View
                key={index}
                style={[styles.fieldRow, styles.additionalIncomeRow]}
              >
                <View style={[styles.flex1, styles.marginRightS]}>
                  <InsetTextInput
                    placeholder="Description"
                    value={income.name}
                    onChangeText={(text) => {
                      const newIncomes = [...additionalIncomes];
                      newIncomes[index].name = text;
                      setAdditionalIncomes(newIncomes);
                    }}
                  />
                </View>
                <View style={[styles.flex1, styles.marginHorizontalS]}>
                  <CurrencyInput
                    placeholder="0.00"
                    value={income.amount}
                    onChangeText={(text) => {
                      const newIncomes = [...additionalIncomes];
                      newIncomes[index].amount = text;
                      setAdditionalIncomes(newIncomes);
                    }}
                  />
                </View>
                {(income.name || income.amount) && (
                  <CancelButton
                    onPress={() => {
                      const newIncomes = [...additionalIncomes];
                      if (newIncomes.length > 1) {
                        newIncomes.splice(index, 1);
                      } else {
                        newIncomes[index] = { name: "", amount: "" };
                      }
                      setAdditionalIncomes(newIncomes);
                    }}
                  />
                )}
              </View>
            ))}
            {showAddIncomeButton && (
              <AddButton
                onPress={() =>
                  setAdditionalIncomes((i) => [...i, { name: "", amount: "" }])
                }
              />
            )}
          </View>
        )}
      </View>
    </>
  );
};

export default PaySpecialDuty;
