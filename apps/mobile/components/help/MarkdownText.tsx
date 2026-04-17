import { useTheme } from "@repo/ui";
import React from "react";
import { StyleSheet, Text } from "react-native";

interface MarkdownTextProps {
  text: string | null | undefined;
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ text }) => {
  const { theme } = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        sectionContent: {
          ...theme.typography.body,
          color: theme.colors.text,
          textAlign: "left",
        },
        markdownParagraph: {
          marginBottom: theme.spacing.s,
        },
        boldText: {
          fontWeight: "bold",
        },
        italicText: {
          fontStyle: "italic",
        },
        underlineText: {
          textDecorationLine: "underline",
        },
      }),
    [theme],
  );

  if (!text) return null;

  // Handle literal \n string sequences that may come from DB/JSON escaping
  const cleanedText = text.replace(/\\n/g, "\n");
  const paragraphs = cleanedText.split("\n\n");

  return (
    <>
      {paragraphs.map((paragraph, pIndex) => {
        const parts =
          paragraph.match(/[^*_]+|(\*\*.*?\*\*|\*.*?\*|_.*?_)/g) || [];

        const styledText = parts.map((part, index) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <Text key={index} style={styles.boldText}>
                {part.slice(2, -2)}
              </Text>
            );
          } else if (part.startsWith("*") && part.endsWith("*")) {
            return (
              <Text key={index} style={styles.italicText}>
                {part.slice(1, -1)}
              </Text>
            );
          } else if (part.startsWith("_") && part.endsWith("_")) {
            return (
              <Text key={index} style={styles.underlineText}>
                {part.slice(1, -1)}
              </Text>
            );
          }
          return <Text key={index}>{part}</Text>;
        });

        return (
          <Text
            key={pIndex}
            style={[styles.sectionContent, styles.markdownParagraph]}
          >
            {styledText}
          </Text>
        );
      })}
    </>
  );
};
