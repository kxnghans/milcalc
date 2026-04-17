import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getAlphaColor, useTheme } from "@repo/ui";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface RoundIconButtonProps {
  onPress: () => void;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  backgroundColor: string;
  size?: number;
  iconSize?: number;
  iconColor?: string;
}

export const RoundIconButton: React.FC<RoundIconButtonProps> = ({
  onPress,
  iconName,
  backgroundColor,
  size = 24,
  iconSize = 16,
  iconColor = "#FFFFFF",
}) => {
  const styles = StyleSheet.create({
    button: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: backgroundColor,
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
      shadowColor: getAlphaColor("#000000", 1),
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <MaterialCommunityIcons
        name={iconName}
        size={iconSize}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

interface AddButtonProps {
  onPress: () => void;
}

export const AddButton: React.FC<AddButtonProps> = ({ onPress }) => {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    addIconContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.s,
    },
  });
  return (
    <View style={styles.addIconContainer}>
      <RoundIconButton
        onPress={onPress}
        iconName="plus"
        backgroundColor={theme.colors.primary}
        size={20}
        iconSize={14}
      />
    </View>
  );
};

interface CancelButtonProps {
  onPress: () => void;
}

export const CancelButton: React.FC<CancelButtonProps> = ({ onPress }) => {
  const { theme } = useTheme();
  return (
    <RoundIconButton
      onPress={onPress}
      iconName="close"
      backgroundColor={theme.colors.error}
      size={20}
      iconSize={14}
    />
  );
};
