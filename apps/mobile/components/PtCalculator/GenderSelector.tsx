/**
 * @file GenderSelector.tsx
 * @description This file defines a component for selecting gender, consisting of two
 * styled buttons for "Male" and "Female".
 */

import * as Icons from "@expo/vector-icons";
import { getAlphaColor, StyledButton, useTheme } from "@repo/ui";
import { ICON_SETS, ICONS } from "@repo/ui/icons";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * A component that renders a gender selection control using two styled buttons.
 * @param {object} props - The component props.
 * @param {string} props.gender - The currently selected gender ('male' or 'female').
 * @param {(gender: string) => void} props.setGender - The function to update the selected gender.
 * @returns {JSX.Element} The rendered gender selector component.
 */
interface GenderSelectorProps {
  gender: string;
  setGender: (gender: string) => void;
}

type IconSet = keyof typeof Icons;

export default function GenderSelector({
  gender,
  setGender,
}: GenderSelectorProps) {
  const { theme, isDarkMode } = useTheme();
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        genderSelectorContainer: {
          flexDirection: "row",
          overflow: "hidden",
          borderRadius: theme.borderRadius.m,
        },
        // Custom style for the text of the inactive button.
        inactiveText: {
          textShadowColor: isDarkMode ? getAlphaColor("#000000", 1) : undefined,
          textShadowRadius: 1,
          textShadowOffset: { width: 0, height: 0 },
          color: theme.colors.primary,
        },
        buttonStyle: {
          flex: 1,
        },
      }),
    [theme, isDarkMode],
  );

  return (
    <View style={styles.genderSelectorContainer}>
      <StyledButton
        title="Male"
        onPress={() => setGender("male")}
        // The button variant is 'primary' if selected, otherwise 'secondary'.
        variant={gender === "male" ? "primary" : "secondary"}
        textStyle={gender !== "male" ? styles.inactiveText : {}}
        size="small"
        style={styles.buttonStyle}
        iconSet={ICON_SETS.FONTISTO as IconSet}
        icon={ICONS.GENDER_MALE}
        highlightOpacity={isDarkMode ? 0.33 : undefined}
        testID="gender-male"
      />
      <StyledButton
        title="Female"
        onPress={() => setGender("female")}
        variant={gender === "female" ? "primary" : "secondary"}
        textStyle={gender !== "female" ? styles.inactiveText : {}}
        size="small"
        style={styles.buttonStyle}
        iconSet={ICON_SETS.FONTISTO as IconSet}
        icon={ICONS.GENDER_FEMALE}
        highlightOpacity={isDarkMode ? 0.33 : undefined}
        testID="gender-female"
      />
    </View>
  );
}
