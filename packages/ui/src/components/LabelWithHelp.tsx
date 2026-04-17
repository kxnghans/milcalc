import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { useTheme } from "../contexts/ThemeContext";

export interface LabelWithHelpProps {
  label: string;
  contentKey: string;
  onPress: (key: string) => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  iconColor?: string;
}

export const LabelWithHelp: React.FC<LabelWithHelpProps> = ({
  label,
  contentKey,
  onPress,
  style,
  textStyle,
  iconColor,
}) => {
  const { theme } = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        defaultContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.spacing.s,
        },
        defaultText: {
          ...theme.typography.subtitle,
          color: theme.colors.text,
          marginBottom: theme.spacing.s,
        },
      }),
    [theme],
  );

  return (
    <View style={style || styles.defaultContainer}>
      <Text style={textStyle || styles.defaultText}>{label}</Text>
      <Pressable onPress={() => onPress(contentKey)}>
        <MaterialCommunityIcons
          name="help-circle-outline"
          size={16}
          color={iconColor || theme.colors.disabled}
        />
      </Pressable>
    </View>
  );
};
