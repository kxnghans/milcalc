import { useTheme } from "@repo/ui";
import { Tables } from "@repo/utils";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { MarkdownText } from "./MarkdownText";

type PayHelpItem = Tables<"pay_help_details">;

interface PayHelpTemplateProps {
  content: PayHelpItem[];
}

export const PayHelpTemplate: React.FC<PayHelpTemplateProps> = ({
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
          {item.recipient_group && (
            <View>
              <Text style={styles.sectionHeader}>Recipient Group</Text>
              <MarkdownText text={item.recipient_group} />
            </View>
          )}
          {item.report_section && (
            <View>
              <Text style={styles.sectionHeader}>Report Section</Text>
              <MarkdownText text={item.report_section} />
            </View>
          )}
        </View>
      ))}
    </>
  );
};
