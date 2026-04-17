import { useRouter } from "expo-router";
import React from "react";
import { ViewStyle } from "react-native";

import { useTheme } from "../contexts/ThemeContext";
import { ICONS } from "../icons";
import { IconRow } from "./IconRow";

export type SmartAction =
  | "reset"
  | "help"
  | "document"
  | "theme"
  | "best_score"
  | "home";

interface SmartIconRowProps {
  actions: SmartAction[];
  onReset?: () => void;
  onHelp?: () => void;
  onDocument?: () => void;
  style?: ViewStyle;
}

export const SmartIconRow: React.FC<SmartIconRowProps> = ({
  actions,
  onReset,
  onHelp,
  onDocument,
  style,
}) => {
  const { theme, themeMode, toggleTheme } = useTheme();
  const router = useRouter();

  const getThemeIcon = () => {
    if (themeMode === "light") return ICONS.THEME_LIGHT;
    if (themeMode === "dark") return ICONS.THEME_DARK;
    return ICONS.THEME_AUTO;
  };

  const icons = actions
    .map((action) => {
      switch (action) {
        case "reset":
          return {
            name: ICONS.RESET,
            onPress: onReset,
            color: theme.colors.primary,
          };
        case "help":
          return {
            name: ICONS.HELP,
            onPress: onHelp,
            color: theme.colors.secondary,
          };
        case "document":
          return {
            name: ICONS.DOCUMENT,
            onPress: onDocument,
            color: theme.colors.text,
          };
        case "theme":
          return {
            name: getThemeIcon(),
            onPress: toggleTheme,
            color: theme.colors.text,
          };
        case "best_score":
          return {
            name: ICONS.BEST_SCORE,
            onPress: () => router.push("/best-score"),
            color: theme.colors.primary,
          };
        case "home":
          return {
            name: themeMode === "auto" ? ICONS.HOME_FILLED : ICONS.HOME,
            onPress: () => router.push("/(tabs)/pt-calculator"),
            color: theme.colors.primary,
          };
        default:
          return null;
      }
    })
    .filter((icon): icon is NonNullable<typeof icon> => icon !== null);

  return <IconRow icons={icons} style={style} />;
};
