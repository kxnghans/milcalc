import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { useTheme } from "../contexts/ThemeContext";
import { lightColors } from "../theme";
import { Icon } from "./Icon";
import NeumorphicOutset from "./NeumorphicOutset";

interface PillButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  colorKey?: keyof typeof lightColors;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  icon?: string;
}

export const PillButton = ({
  title,
  onPress,
  backgroundColor,
  colorKey,
  textColor,
  style,
  containerStyle,
  textStyle,
  disabled,
  icon,
}: PillButtonProps) => {
  const { theme } = useTheme();

  const resolvedBackgroundColor = colorKey
    ? (theme.colors[colorKey] as string)
    : backgroundColor;
  const buttonColor = disabled
    ? theme.colors.disabled
    : resolvedBackgroundColor || theme.colors.primary;
  const buttonTextColor = textColor || theme.colors.primaryText;

  const styles = StyleSheet.create({
    button: {
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      elevation: 2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonContainer: {
      alignSelf: "center",
    },
    text: {
      color: buttonTextColor,
      fontWeight: "bold",
      textAlign: "center",
    },
    outsetContent: {
      borderRadius: 20,
    },
    icon: {
      marginRight: 8,
    },
  });

  return (
    <NeumorphicOutset
      containerStyle={[styles.buttonContainer, containerStyle || style]}
      contentStyle={styles.outsetContent} // Explicitly pass the pill radius
    >
      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonColor }]}
        onPress={onPress}
        disabled={disabled}
      >
        {icon && (
          <View style={styles.icon}>
            <Icon name={icon} size={18} color={buttonTextColor} />
          </View>
        )}
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </NeumorphicOutset>
  );
};
