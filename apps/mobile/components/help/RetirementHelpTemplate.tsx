import { useTheme } from "@repo/ui";
import { Tables } from "@repo/utils";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { MarkdownText } from "./MarkdownText";

type RetirementHelpItem = Tables<"retirement_help_details">;

interface RetirementHelpTemplateProps {
  content: RetirementHelpItem[];
}

export const RetirementHelpTemplate: React.FC<RetirementHelpTemplateProps> = ({
  content,
}) => {
  const { theme } = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        sectionContainer: {
          marginBottom: theme.spacing.m,
        },
        sectionHeader: {
          ...theme.typography.subtitle,
          color: theme.colors.text,
          marginTop: theme.spacing.m,
          marginBottom: theme.spacing.s,
          textAlign: "left",
        },
      }),
    [theme],
  );

  return (
    <>
      {content.map((item, index) => (
        <View key={index} style={styles.sectionContainer}>
          {item.purpose_description && (
            <View>
              <Text style={styles.sectionHeader}>Purpose Description</Text>
              <MarkdownText text={item.purpose_description} />
            </View>
          )}
          {item.calculation_details && (
            <View>
              <Text style={styles.sectionHeader}>Calculation Details</Text>
              <MarkdownText text={item.calculation_details} />
            </View>
          )}
          {item.example && (
            <View>
              <Text style={styles.sectionHeader}>Example</Text>
              <MarkdownText text={item.example} />
            </View>
          )}
        </View>
      ))}
    </>
  );
};
