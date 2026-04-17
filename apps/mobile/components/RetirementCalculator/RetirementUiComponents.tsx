import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextStyle, View, ViewStyle } from "react-native";

export interface LabelWithHelpProps {
  label: string;
  contentKey: string;
  onPress: (key: string) => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  iconColor: string;
}

export const LabelWithHelp = ({
  label,
  contentKey,
  onPress,
  style,
  textStyle,
  iconColor,
}: LabelWithHelpProps) => (
  <View style={style}>
    <Text style={textStyle}>{label}</Text>
    <Pressable onPress={() => onPress(contentKey)}>
      <MaterialCommunityIcons
        name="help-circle-outline"
        size={16}
        color={iconColor}
      />
    </Pressable>
  </View>
);
