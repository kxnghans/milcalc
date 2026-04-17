import { useTheme } from "@repo/ui";
import { Tables } from "@repo/utils";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { MarkdownText } from "./MarkdownText";

type PtHelpItem = Tables<"pt_help_details"> | Tables<"best_score_help_details">;

interface PtHelpTemplateProps {
  content: PtHelpItem[];
}

export const PtHelpTemplate: React.FC<PtHelpTemplateProps> = ({ content }) => {
  const { theme } = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
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

  const sectionOrder = ["Performance", "Resting", "Scoring", "Exemption"];

  const sortedContent = [...content].sort((a, b) => {
    const aIndex = sectionOrder.indexOf(a.section_header || "");
    const bIndex = sectionOrder.indexOf(b.section_header || "");
    return aIndex - bIndex;
  });

  return (
    <>
      {sortedContent.map((item, index) => (
        <View key={index}>
          {item.section_header && (
            <Text style={styles.sectionHeader}>{item.section_header}</Text>
          )}
          <MarkdownText text={item.section_content} />
        </View>
      ))}
    </>
  );
};
